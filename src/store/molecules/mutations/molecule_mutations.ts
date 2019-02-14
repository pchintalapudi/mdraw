import { StateType } from "../state";
import { RGroup } from ".././../../models";

let moleculeMutations = {
  createRGroup({ stateMachine }: StateType, rgroup: RGroup) {
    stateMachine.placing = rgroup;
  }
};

export default moleculeMutations;