import { StateType, state } from "../state";
import { RGroup, DrawerState } from ".././../../models";

let moleculeMutations = {
  createRGroup({ stateMachine }: StateType, rgroup: RGroup) {
    stateMachine.placing = rgroup;
    stateMachine.state = DrawerState.PLACING_NEW_ATOM;
  },
  cancelRGroupCreation({ rgroups, stateMachine }: StateType) {
    rgroups.splice(rgroups.indexOf(stateMachine.placing!), 1);
    stateMachine.placing = undefined;
    stateMachine.state = DrawerState.IDLE;
  }
};

export default moleculeMutations;
