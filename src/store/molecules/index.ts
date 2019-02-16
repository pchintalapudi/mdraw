import { Module } from "vuex";
import { state, StateType } from "./state";
import { genericMutations, moleculeMutations } from "./mutations";
import { moleculeActions } from "./actions";

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  mutations: {
    ...genericMutations,
    ...moleculeMutations
  },
  actions: {
    ...moleculeActions
  }
};

export default module;
