import { ActionContext } from "vuex";
import { StateType } from "../state";
import { DrawerState, RGroup, Bond } from "../../../models";
import { minShift } from "../../../constants";

let mGestures = {
  finishGesture({
    state,
    dispatch,
    commit,
    rootState
  }: ActionContext<StateType, any>) {
    let undo, redo;
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        return;
      case DrawerState.SELECTING:
        commit("clearStateMachine", false);
        commit("clearPointerState");
        return;
      case DrawerState.PLACING_NEW_ATOM: {
        let rgroup = state.stateMachine.creating!;
        undo = () => {
          dispatch("defaultCancel");
          commit("popRGroup");
        };
        redo = () => {
          dispatch("defaultCancel");
          commit("pushRGroup", rgroup);
        };
        break;
      }
      case DrawerState.PLACING_NEW_ATOM_AND_BOND: {
        let rgroup = state.stateMachine.creating!,
          bond = state.stateMachine.adding!;
        undo = () => {
          dispatch("defaultCancel");
          commit("popRGroup");
          commit("popBond");
          bond.start.bonds.delete(bond.id);
        };
        redo = () => {
          dispatch("defaultCancel");
          commit("pushRGroup", rgroup);
          commit("pushBond", bond);
          bond.start.bonds.set(bond.id, bond);
        };
        commit("history/logAction", { undo, redo }, { root: true });
        commit("clearStateMachine", false);
        commit(
          "setAngle",
          Math.atan2(bond.end.y - bond.start.y, bond.end.x - bond.start.x)
        );
        commit("createBond", rgroup);
        return;
      }
      case DrawerState.MOVING: {
        if (
          Date.now() - state.pointerState.initTime < rootState.clickTime &&
          Math.hypot(
            state.pointerState.start!.x - state.stateMachine.creating!.x,
            state.pointerState.start!.y - state.stateMachine.creating!.y
          ) < minShift
        ) {
          commit("cancelMove");
          let rgroup = state.stateMachine.creating!;
          commit("clearStateMachine", false);
          commit("createBond", rgroup);
          state.stateMachine.state = DrawerState.PLACING_NEW_ATOM_AND_BOND;
          return;
        } else {
          if (
            state.stateMachine.selected.indexOf(
              state.stateMachine.creating!
            ) !== -1
          ) {
            let rgroups = [...state.stateMachine.selected],
              dx = state.stateMachine.creating!.x - state.pointerState.start!.x,
              dy = state.stateMachine.creating!.y - state.pointerState.start!.y;
            undo = () => {
              dispatch("defaultCancel");
              for (let rgroup of rgroups) {
                rgroup.x -= dx;
                rgroup.y -= dy;
              }
            };
            redo = () => {
              dispatch("defaultCancel");
              for (let rgroup of rgroups) {
                rgroup.x += dx;
                rgroup.y += dy;
              }
            };
          } else {
            let rgroup = state.stateMachine.creating!,
              start = state.pointerState.start!,
              end = { x: rgroup.x, y: rgroup.y };
            undo = () => {
              dispatch("defaultCancel");
              rgroup.x = start.x;
              rgroup.y = start.y;
            };
            redo = () => {
              dispatch("defaultCancel");
              rgroup.x = end.x;
              rgroup.y = end.y;
            };
          }
        }
      }
    }
    commit("history/logAction", { undo, redo }, { root: true });
    commit("clearStateMachine", false);
    commit("clearPointerState");
  },
  rgroupEnd(
    { state, commit, dispatch }: ActionContext<StateType, any>,
    rgroup: RGroup
  ) {
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        break;
      case DrawerState.PLACING_NEW_ATOM: {
        let payload = state.stateMachine.creating!.payload,
          oldPayload = rgroup.payload;
        if (payload == oldPayload) break;
        let undo = () => {
            dispatch("defaultCancel");
            commit("swapPayload", { rgroup, payload: oldPayload });
          },
          redo = () => {
            dispatch("defaultCancel");
            commit("swapPayload", { rgroup, payload });
          };
        commit("history/logAction", { undo, redo }, { root: true });
        commit("swapPayload", { rgroup, payload });
        commit("popRGroup");
        commit("clearStateMachine", false);
        dispatch("createAtom");
        return;
      }
      case DrawerState.PLACING_NEW_ATOM_AND_BOND: {
        if (
          state.stateMachine.adding!.start != rgroup &&
          state.stateMachine.adding!.end != rgroup
        ) {
          let bond = state.stateMachine.adding!,
            undo = () => {
              dispatch("defaultCancel");
              rgroup.bonds.delete(bond.id);
              commit("popBond");
            },
            redo = () => {
              dispatch("defaultCancel");
              commit("pushBond", bond);
              commit("swapBond", { rgroup, bond });
            };
          commit("history/logAction", { undo, redo }, { root: true });
          commit("swapBond", { rgroup, bond });
          commit("popRGroup");
        } else dispatch("defaultCancel");
        break;
      }
      case DrawerState.MOVING: {
        //First we swap the payload and delete the currently moving atom.
        //Watch for the edge case of the two joined atoms being bonded together
        //Then we need to log the positions of all the selected atoms and calculate their backwards positions
        let deleteMe = state.stateMachine.creating!,
          oldPayload = rgroup.payload,
          dx = rgroup.x - state.pointerState.start!.x,
          dy = rgroup.y - state.pointerState.start!.y,
          idx = state.rgroups.indexOf(deleteMe),
          shifted = new Set(state.stateMachine.selected),
          swappedBonds: Bond[] = Array.from(deleteMe.bonds.values()),
          oldBonds = [...state.bonds],
          newBondSet = new Set(state.bonds);
        swappedBonds.forEach(b => newBondSet.delete(b));
        let clonedBonds = swappedBonds.map(b => {
            let bond = b.clone();
            if (bond.start == deleteMe) bond.start = rgroup;
            else bond.end = rgroup;
            return bond;
          }),
          newBonds = Array.from(newBondSet);
        clonedBonds.forEach(b => newBonds.push(b));
        let undo = () => {
            dispatch("defaultCancel");
            commit("insertRGroup", { idx, rgroup: deleteMe });
            commit("swapPayload", { rgroup, payload: oldPayload });
            shifted.forEach(r => {
              r.x -= dx;
              r.y -= dy;
            });
            swappedBonds.forEach(b => {
              rgroup.bonds.delete(b.id);
              b.getPeer(deleteMe)!.bonds.set(b.id, b);
            });
            commit("swapBonds", oldBonds);
          },
          redo = () => {
            dispatch("defaultCancel");
            commit("deleteRGroup", idx);
            commit("swapPayload", { rgroup, payload: deleteMe.payload });
            shifted.forEach(r => {
              r.x += dx;
              r.y += dy;
            });
            clonedBonds.forEach(b => {
              rgroup.bonds.set(b.id, b);
              b.getPeer(rgroup)!.bonds.set(b.id, b);
            });
            commit("swapBonds", newBonds);
          };
        clonedBonds.forEach(b => {
          rgroup.bonds.set(b.id, b);
          b.getPeer(rgroup)!.bonds.set(b.id, b);
        });
        commit("swapBonds", newBonds);
        commit("history/logAction", { undo, redo }, { root: true });
        commit("deleteRGroup", idx);
        commit("swapPayload", { rgroup, payload: deleteMe.payload });
        break;
      }
    }
    commit("clearStateMachine", false);
    commit("clearPointerState");
  }
};

export default mGestures;
