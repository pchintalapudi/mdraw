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
        commit("history/logAction", { undo, redo }, { root: true });
        commit("clearStateMachine");
        commit("createBond", rgroup);
        return;
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
  }
};

export default mGestures;
