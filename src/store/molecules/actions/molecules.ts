import { ActionContext, Action } from "vuex";
import { StateType } from "../state";
import {
  DrawerState,
  BondState,
  Bond,
  RGroup,
  StateMachine
} from "../../../models";
import calculateAngle from "./angles";

let actions = {
  defaultCancel({ state, commit }: ActionContext<StateType, any>) {
    switch (state.stateMachine.state) {
      default:
      case DrawerState.IDLE:
        break;
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
  finishGesture(
    { state, dispatch, commit, rootState }: ActionContext<StateType, any>,
    obj?: { replace: RGroup }
  ) {
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
      }
      case DrawerState.MOVING_ATOM: {
        if (Date.now() - state.pointerState.initTime > rootState.clickTime) {
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
        } else {
          commit("cancelMove");
          let rgroup = state.stateMachine.placing!;
          commit("clearStateMachine");
          commit("createBond", rgroup);
          return;
        }
      }
    }
    commit("history/logAction", { undo, redo }, { root: true });
    commit("clearStateMachine");
    commit("clearPointerState");
  },
  moveEvent(
    { state }: ActionContext<StateType, any>,
    { x, y, force }: { x: number; y: number; force?: boolean }
  ) {
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        break;
      case DrawerState.PLACING_NEW_ATOM:
      case DrawerState.MOVING_ATOM:
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
            dist = Math.hypot(end.x - start.x, end.y - start.y),
            angle = calculateAngle(
              dist,
              Math.atan2(end.x - start.x, end.y - start.y)
            );
          end.x = dist * Math.cos(angle);
          end.y = dist * Math.sin(angle);
          break;
        }
      }
    }
  },
  changeBondState(
    { state, commit }: ActionContext<StateType, any>,
    { bond, bondState }: { bond: Bond; bondState: BondState }
  ) {
    if (state.stateMachine.state == DrawerState.IDLE) {
      let prevState = bond.state,
        undo = () => (bond.state = prevState),
        redo = () => (bond.state = bondState);
      redo();
      commit("history/logAction", { undo, redo }, { root: true });
    }
  },
  finishRGroupClick(
    { state, commit, rootState }: ActionContext<StateType, any>,
    rgroup: RGroup
  ) {
    if (Date.now() - state.pointerState.initTime > rootState.clickTime) {
      switch (state.stateMachine.state) {
        default:
          return;
        case DrawerState.MOVING_ATOM:
          rgroup = state.stateMachine.placing!;
          commit("cancelMove");
        case DrawerState.IDLE:
          commit("createBond", rgroup);
          break;
      }
    } else {
      switch (state.stateMachine.state) {
        default:
          return;
        case DrawerState.IDLE:
          commit("createBond", rgroup);
          break;
      }
    }
  }
};

export default actions;
