import { ActionContext } from "vuex";
import { StateType } from "../state";
import {
  DrawerState,
  BondState,
  Bond,
  RGroup,
  RGroupSerialized,
  BondSerialized,
  Payload,
  elements
} from "../../../models";
import calculateAngle from "./angles";
import { defaultBondDist, minShift } from "../../../constants";

let actions = {
  defaultCancel({ state, commit }: ActionContext<StateType, any>) {
    switch (state.stateMachine.state) {
      default:
      case DrawerState.IDLE:
        return;
      case DrawerState.MOVING_ATOM:
        commit("cancelMove");
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        commit("cancelBondCreation");
        break;
      case DrawerState.PLACING_NEW_ATOM:
        commit("cancelRGroupCreation");
        break;
    }
    commit("clearStateMachine");
    commit("clearPointerState");
  },
  createAtom({ state, commit }: ActionContext<StateType, any>) {
    if (state.atomicNumber > 0 && state.atomicNumber <= elements.length)
      commit("createRGroup", new RGroup(elements[state.atomicNumber - 1]));
  },
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
      case DrawerState.PLACING_NEW_ATOM: {
        let rgroup = state.stateMachine.placing!;
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
        let rgroup = state.stateMachine.placing!,
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
        break;
      }
      case DrawerState.MOVING_ATOM: {
        if (
          Date.now() - state.pointerState.initTime < rootState.clickTime &&
          Math.hypot(
            state.pointerState.start!.x - state.stateMachine.placing!.x,
            state.pointerState.start!.y - state.stateMachine.placing!.y
          ) < minShift
        ) {
          commit("cancelMove");
          let rgroup = state.stateMachine.placing!;
          commit("clearStateMachine");
          commit("createBond", rgroup);
          state.stateMachine.state = DrawerState.PLACING_NEW_ATOM_AND_BOND;
          return;
        } else {
          let rgroup = state.stateMachine.placing!,
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
    commit("history/logAction", { undo, redo }, { root: true });
    commit("clearStateMachine");
    commit("clearPointerState");
  },
  moveEvent(
    { state, rootState }: ActionContext<StateType, any>,
    { x, y, force }: { x: number; y: number; force?: boolean }
  ) {
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        break;
      case DrawerState.MOVING_ATOM:
      case DrawerState.PLACING_NEW_ATOM:
        state.stateMachine.placing!.x = x;
        state.stateMachine.placing!.y = y;
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND: {
        if (force) {
          state.stateMachine.placing!.x = x;
          state.stateMachine.placing!.y = y;
        } else {
          let start = state.stateMachine.adding!.start,
            end = state.stateMachine.placing!,
            angle = calculateAngle(
              defaultBondDist,
              (180 / Math.PI) * Math.atan2(x - start.x, y - start.y) - 90
            );
          end.x = start.x + defaultBondDist * Math.cos(angle);
          end.y = start.y + defaultBondDist * Math.sin(angle);
          break;
        }
      }
    }
  },
  changeBondState(
    { state, commit, dispatch }: ActionContext<StateType, any>,
    { bond, bondState }: { bond: Bond; bondState: BondState }
  ) {
    if (state.stateMachine.state == DrawerState.IDLE) {
      let prevState = bond.state,
        undo = () => {
          dispatch("defaultCancel");
          bond.state = prevState;
        },
        redo = () => {
          dispatch("defaultCancel");
          bond.state = bondState;
        };
      redo();
      commit("history/logAction", { undo, redo }, { root: true });
    }
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
        let payload = state.stateMachine.placing!.payload,
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
        commit("clearStateMachine");
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
    commit("clearStateMachine");
    commit("clearPointerState");
  },
  async save({ state }: ActionContext<StateType, any>) {
    let rgroupCopy: RGroup[], bondCopy: Bond[];
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        rgroupCopy = [...state.rgroups];
        bondCopy = [...state.bonds];
        break;
      case DrawerState.PLACING_NEW_ATOM:
        rgroupCopy = [...state.rgroups];
        rgroupCopy.pop();
        bondCopy = [...state.bonds];
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        rgroupCopy = [...state.rgroups];
        bondCopy = [...state.bonds];
        rgroupCopy.pop();
        bondCopy.pop();
        break;
    }
    return JSON.stringify([rgroupCopy, bondCopy]);
  },
  async load(
    { state, dispatch, commit }: ActionContext<StateType, any>,
    model: string
  ) {
    console.log("here");
    console.log(model);
    let deserialized = JSON.parse(model),
      rgroupShades: RGroupSerialized[] = deserialized[0],
      bondShades: BondSerialized[] = deserialized[1],
      rgroupMap = new Map<number, number>(),
      rgroups: RGroup[] = [];
    rgroupShades.forEach(r => {
      let rgroup = new RGroup(
        r.atomicNumber ? elements[r.atomicNumber - 1] : r.payload!
      );
      rgroup.charge = r.charge;
      rgroup.x = r.x;
      rgroup.y = r.y;
      rgroupMap.set(r.id, rgroups.length);
      rgroups.push(rgroup);
    });
    let bonds: Bond[] = bondShades.map(b => {
      let bond = new Bond(
        rgroups[rgroupMap.get(b.start)!],
        rgroups[rgroupMap.get(b.end)!]
      );
      bond.start.bonds.set(bond.id, bond);
      bond.end.bonds.set(bond.id, bond);
      return bond;
    });
    let undo = () => {
        dispatch("defaultCancel");
        state.rgroups.splice(
          state.rgroups.length - rgroups.length,
          rgroups.length
        );
        state.bonds.splice(state.bonds.length - bonds.length, bonds.length);
      },
      redo = () => {
        dispatch("defaultCancel");
        state.rgroups.push(...rgroups);
        state.bonds.push(...bonds);
      };
    commit("history/logAction", { undo, redo }, { root: true });
    redo();
  }
};

export default actions;
