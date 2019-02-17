import { ActionContext } from "vuex";
import { StateType } from "../state";
import { DrawerState, BondState } from "../../../models";

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
        dispatch("history/logAction", { undo, redo });
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
        dispatch("history/logAction", { undo, redo });
        commit("clearStateMachine");
        commit("clearPointerState");
      }
    }
  }
};

export default actions;
