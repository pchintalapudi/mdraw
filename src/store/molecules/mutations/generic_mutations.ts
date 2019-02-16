import { StateType } from "../state";
import { DrawerState } from "../../../models";

let genericMutations = {
  setDrawPane({ pointerState }: StateType, drawPane: SVGSVGElement) {
    pointerState._drawPane = drawPane;
  },
  lockPointer({ pointerState }: StateType, pevent: PointerEvent) {
    pointerState.pointer = pevent.pointerId;
    pointerState.lock = true;
  },
  unlockPointer({ pointerState }: StateType) {
    pointerState.lock = false;
  },
  startPress({ pointerState }: StateType) {
    pointerState.mouseDown = true;
  },
  endPress({ pointerState }: StateType) {
    pointerState.mouseDown = false;
  }
};

export default genericMutations;
