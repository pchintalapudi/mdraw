import { Module } from "vuex";
import { RGroup, Bond, DrawerState, StateMachine, elements } from "../models";

let pointerState = {
  _drawPane: undefined as undefined | SVGSVGElement,
  pointer: 0,
  startX: 0,
  startY: 0,
  lock: false
};

let state = {
  rgroups: [] as RGroup[],
  selected: [] as RGroup[],
  bonds: [] as Bond[],
  pointerState,
  stateMachine: new StateMachine()
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  getters: {
    drawPane({ pointerState }) {
      return pointerState._drawPane;
    }
  },
  mutations: {
    setDrawPane({ pointerState }, drawPane: SVGSVGElement) {
      pointerState._drawPane = drawPane;
    },
    setState({ stateMachine }, state: DrawerState) {
      stateMachine.state = state;
    },
    createRGroup({ stateMachine }, rgroup: RGroup) {
      stateMachine.placing = rgroup;
    },
    lockPointer({ pointerState }, pevent: PointerEvent) {
      pointerState.pointer = pevent.pointerId;
      pointerState.lock = true;
    },
    unlockPointer({ pointerState }) {
      pointerState.lock = false;
    }
  },
  actions: {
    createAtom(store, atomicNumber: number) {
      let rgroup = new RGroup(elements[atomicNumber - 1]);
      store.commit("setState", DrawerState.PLACING_NEW_ATOM);
      store.commit("createRGroup", rgroup);
    }
  }
};

export default module;
