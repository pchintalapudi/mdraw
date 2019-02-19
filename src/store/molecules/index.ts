import { Module } from "vuex";
import { state, StateType } from "./state";
import {
  genericMutations,
  moleculeMutations,
  selectionMutations
} from "./mutations";
import { moleculeActions } from "./actions";

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  mutations: {
    ...genericMutations,
    ...moleculeMutations,
    ...selectionMutations
  },
  actions: {
    ...moleculeActions
  }
};

export default module;
