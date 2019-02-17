import { StateType } from "../state";
import { DrawerState } from "../../../models";

let genericMutations = {
  setDrawPane({ pointerState }: StateType, drawPane: SVGSVGElement) {
    pointerState._drawPane = drawPane;
  },
  startPress({ pointerState }: StateType) {
    pointerState.mouseDown = true;
  },
  endPress({ pointerState }: StateType) {
    pointerState.mouseDown = false;
  },
  clearPointerState({ pointerState }: StateType) {
    pointerState.start = undefined;
    pointerState.mouseDown = false;
  },
  clearStateMachine({ stateMachine }: StateType) {
    stateMachine.state = DrawerState.IDLE;
    stateMachine.placing = stateMachine.adding = undefined;
  }
};

export default genericMutations;
