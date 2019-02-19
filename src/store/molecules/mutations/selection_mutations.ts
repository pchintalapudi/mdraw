import { StateType } from "../state";
import { RGroup } from "../../../models";

let selectionMutations = {
  select({ stateMachine }: StateType, rgroup: RGroup) {
    if (stateMachine.selected.indexOf(rgroup) === -1)
      stateMachine.selected.push(rgroup);
  },
  deselect({ stateMachine }: StateType, rgroup: RGroup) {
    let index = stateMachine.selected.indexOf(rgroup);
    if (index !== -1) stateMachine.selected.splice(index, 1);
  },
  selectAll({ stateMachine }: StateType, rgroups: RGroup[]) {
    for (let rgroup of rgroups) {
      if (stateMachine.selected.indexOf(rgroup) === -1)
        stateMachine.selected.push(rgroup);
    }
  },
  deselectAll({ stateMachine }: StateType, rgroups: RGroup[]) {
    for (let rgroup of rgroups) {
      let index = stateMachine.selected.indexOf(rgroup);
      if (index !== -1) stateMachine.selected.splice(index, 1);
    }
  },
  clearSelected({ stateMachine }: StateType) {
    stateMachine.selected.length = 0;
  }
};

export default selectionMutations;
