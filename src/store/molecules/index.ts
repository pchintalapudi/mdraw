import { Module } from "vuex";
import { RGroup, Bond, DrawerState, elements } from "../../models";
import { state, StateType } from "./state";
import { genericMutations, moleculeMutations } from "./mutations";

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  getters: {
    isConsumable({ stateMachine }, obj: RGroup | Bond) {
      return obj != stateMachine.adding && obj != stateMachine.placing;
    }
  },
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
    mouseDown(store, obj: RGroup | Bond) {
      if (!store.getters["isConsumable"](obj)) {
      }
    }
  }
};

export default module;
