import { ActionContext } from "vuex";
import { StateType } from "../state";
import { DrawerState, BondState } from "../../../models";
import calculateAngle from "./angles";

let actions = {
  defaultCancel(store: ActionContext<StateType, any>) {
    switch (store.state.stateMachine.state) {
      default:
      case DrawerState.IDLE:
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        store.commit("cancelBondCreation");
        break;
      case DrawerState.PLACING_NEW_ATOM:
        store.commit("cancelRGroupCreation");
        break;
    }
    store.state.stateMachine.state = DrawerState.IDLE;
  },
  finishGesture({ state, dispatch, commit }: ActionContext<StateType, any>) {
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        break;
      case DrawerState.PLACING_NEW_ATOM: {
        let rgroup = state.stateMachine.placing!,
          undo = () => {
            dispatch("defaultCancel");
            commit("popRGroup");
          },
          redo = () => {
            dispatch("defaultCancel");
            commit("pushRGroup", rgroup);
          };
        dispatch("history/logAction", { undo, redo }, { root: true });
        commit("clearStateMachine");
        commit("clearPointerState");
        break;
      }
      case DrawerState.PLACING_NEW_ATOM_AND_BOND: {
        let rgroup = state.stateMachine.placing!,
          bond = state.stateMachine.adding!,
          undo = () => {
            dispatch("defaultCancel");
            commit("popRGroup");
            commit("popBond");
            bond.start.bonds.delete(bond.id);
          },
          redo = () => {
            dispatch("defaultCancel");
            commit("pushRGroup", rgroup);
            commit("pushBond", bond);
            bond.start.bonds.set(bond.id, bond);
          };
        dispatch("history/logAction", { undo, redo }, { root: true });
        commit("clearStateMachine");
        commit("clearPointerState");
      }
    }
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
  }
};

export default actions;
