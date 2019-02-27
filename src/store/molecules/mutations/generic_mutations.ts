import { StateType } from "../state";
import { DrawerState } from "../../../models";

let genericMutations = {
  setDrawPane({ pointerState }: StateType, drawPane: SVGSVGElement) {
    pointerState._drawPane = drawPane;
  },
  clearPointerState({ pointerState }: StateType) {
    pointerState.start = pointerState.end = undefined;
    pointerState.initTime = 0;
  },
  clearStateMachine({ stateMachine }: StateType, clearSelected = true) {
    stateMachine.state = DrawerState.IDLE;
    stateMachine.creating = stateMachine.adding = undefined;
    if (clearSelected) stateMachine.selected.length = 0;
    stateMachine.lastAngle = 0;
  },
  updateEnd({ pointerState }: StateType, obj: { x: number; y: number }) {
    pointerState.end = obj;
  },
  setAngle({ stateMachine }: StateType, angle: number) {
    stateMachine.lastAngle = angle;
  }
};

export default genericMutations;
