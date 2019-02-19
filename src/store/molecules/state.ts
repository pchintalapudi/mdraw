import { RGroup, Bond, StateMachine } from "../../models";

let pointerState = {
  _drawPane: undefined as undefined | SVGSVGElement,
  start: undefined as undefined | { x: number; y: number },
  end: undefined as undefined | { x: number; y: number },
  initTime: 0
};

let state = {
  rgroups: [] as RGroup[],
  bonds: [] as Bond[],
  pointerState,
  stateMachine: new StateMachine(),
  omitting: false,
  atomicNumber: 6
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

export { state, StateType };
