import { StateType } from "../state";
import { RGroup } from "../../../models";

let selectionMutations = {
  select({ selected }: StateType, rgroup: RGroup) {
    selected.push(rgroup);
  },
  deselect({ selected }: StateType, rgroup: RGroup) {
    let index;
    while ((index = selected.indexOf(rgroup))) selected.splice(index, 1);
  },
  selectAll({ selected }: StateType, rgroups: RGroup[]) {
    selected.push(...rgroups);
  },
  deselectAll({ selected }: StateType, rgroups: RGroup[]) {
    for (let i = selected.length; i-- > 0; ) {
      let index = rgroups.indexOf(selected[i]);
      if (index != -1) selected.splice(i, 1);
    }
  },
  clearSelected({ selected }: StateType) {
    selected.length = 0;
  }
};

export default selectionMutations;
