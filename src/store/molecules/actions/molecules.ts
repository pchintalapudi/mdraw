import { ActionContext } from "vuex";
import { StateType } from "../state";
import { DrawerState } from "../../../models";

let actions = {
  defaultCancel(store: ActionContext<StateType, any>) {
      switch(store.state.stateMachine.state) {
          default:
          case DrawerState.IDLE:
          return;
          case DrawerState.PLACING_NEW_ATOM:
          store.commit("cancelRGroupCreation");
          return;
      }
  }
};

export default actions;
