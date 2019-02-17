import { Module } from "vuex";
import { state, StateType } from "./state";
import { genericMutations, moleculeMutations } from "./mutations";
import { moleculeActions } from "./actions";

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  getters: {
    isClick({pointerState}, time:number) {
      return time - pointerState.initTime < 500;
    }
  },
  mutations: {
    ...genericMutations,
    ...moleculeMutations
  },
  actions: {
    ...moleculeActions
  }
};

export default module;
