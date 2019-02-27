import { ActionContext } from "vuex";
import { StateType } from "../state";
import { DrawerState, RGroup } from "../../../models";
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
      }
    }
    commit("clearStateMachine", false);
    commit("clearPointerState");
  }
};

export default mGestures;
