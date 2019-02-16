import { ActionContext } from "vuex";
import { StateType } from "../state";
import { DrawerState } from "../../../models";

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
  }
};

export default actions;
