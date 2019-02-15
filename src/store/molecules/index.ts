import { Module } from "vuex";
import { RGroup, Bond, DrawerState, elements } from "../../models";
import { state, StateType } from "./state";
import { genericMutations, moleculeMutations } from "./mutations";

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  mutations: {
    ...genericMutations,
    ...moleculeMutations
  },
  actions: {
    createAtom(store, atomicNumber: number) {
      let rgroup = new RGroup(elements[atomicNumber - 1]);
      store.commit("setState", DrawerState.PLACING_NEW_ATOM);
      store.commit("createRGroup", rgroup);
    },
    mouseDown(
      store,
      { obj, el, ev }: { obj?: RGroup | Bond; el: Element; ev: PointerEvent }
    ) {
      if (obj) {
      } else {
        store.commit("lockPointer", ev.pointerId);
        el.setPointerCapture(ev.pointerId);
        store.commit("startPress");
      }
    },
    mouseUp(
      store,
      { obj, el, ev }: { obj?: RGroup | Bond; el: Element; ev: PointerEvent }
    ) {}
  }
};

export default module;
