import { RGroup, Bond, StateMachine } from "../../models";

let pointerState = {
  _drawPane: undefined as undefined | SVGSVGElement,
  pointer: 0,
  start: undefined as undefined | { x: number; y: number },
  mouseDown: false
};

let state = {
  rgroups: [] as RGroup[],
  bonds: [] as Bond[],
  pointerState,
  stateMachine: new StateMachine()
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

export { state, StateType };
