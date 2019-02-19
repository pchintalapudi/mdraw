import { StateType } from "../state";
import { RGroup, DrawerState } from "../../../models";

let selectionMutations = {
  select({ stateMachine }: StateType, rgroup: RGroup) {
    if (stateMachine.selected.indexOf(rgroup) === -1)
      stateMachine.selected.push(rgroup);
  },
  deselect({ stateMachine }: StateType, rgroup: RGroup) {
    let index = stateMachine.selected.indexOf(rgroup);
    if (index !== -1) stateMachine.selected.splice(index, 1);
  },
  selectAllUnsafe({ stateMachine }: StateType, rgroups: RGroup[]) {
    stateMachine.selected.push(...rgroups);
  },
  deselectAll({ stateMachine }: StateType, rgroups: RGroup[]) {
    for (let rgroup of rgroups) {
      let index = stateMachine.selected.indexOf(rgroup);
      if (index !== -1) stateMachine.selected.splice(index, 1);
    }
  },
  clearSelected({ stateMachine }: StateType) {
    stateMachine.selected.length = 0;
  },
  requestSelect(
    { stateMachine, pointerState }: StateType,
    obj: { x: number; y: number }
  ) {
    if (stateMachine.state === DrawerState.IDLE) {
      pointerState.start = obj;
      pointerState.end = obj;
      pointerState.initTime = Date.now();
      stateMachine.state = DrawerState.SELECTING;
    }
  },
  cancelSelecting({ stateMachine }: StateType) {
    stateMachine.state = DrawerState.IDLE;
  }
};

export default selectionMutations;
