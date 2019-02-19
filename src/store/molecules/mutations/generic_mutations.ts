import { StateType, state } from "../state";
import { DrawerState } from "../../../models";

let genericMutations = {
  setDrawPane({ pointerState }: StateType, drawPane: SVGSVGElement) {
    pointerState._drawPane = drawPane;
  },
  clearPointerState({ pointerState }: StateType) {
    pointerState.start = undefined;
    pointerState.initTime = 0;
  },
  clearStateMachine({ stateMachine }: StateType, clearSelected = true) {
    stateMachine.state = DrawerState.IDLE;
    stateMachine.creating = stateMachine.adding = undefined;
    if (clearSelected) stateMachine.selected.length = 0;
  }
};

export default genericMutations;
