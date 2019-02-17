import { StateType } from "../state";
import { DrawerState } from "../../../models";

let genericMutations = {
  setDrawPane({ pointerState }: StateType, drawPane: SVGSVGElement) {
    pointerState._drawPane = drawPane;
  },
  clearPointerState({ pointerState }: StateType) {
    pointerState.start = undefined;
    pointerState.initTime = 0;
  },
  clearStateMachine({ stateMachine }: StateType) {
    stateMachine.state = DrawerState.IDLE;
    stateMachine.placing = stateMachine.adding = undefined;
  }
};

export default genericMutations;
