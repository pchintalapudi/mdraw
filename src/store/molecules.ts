import { Module } from "vuex";
import { RGroup, Bond } from "../models";

let state = {
  rgroups: [] as RGroup[],
  selected: [] as RGroup[],
  bonds: [] as Bond[]
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

const module: Module<StateType, any> = {
  state,
  mutations: {
      
  },
  actions: {}
};

export default module;