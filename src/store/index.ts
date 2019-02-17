import Vue from "vue";
import Vuex from "vuex";
import history from "./history";
import molecules from "./molecules";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: { theme: "standard", clickTime: 500, defaultDist: 75, minShift:5 },
  mutations: {
    theme(state, newTheme: string) {
      state.theme = newTheme;
    }
  },
  modules: {
    history,
    molecules
  }
});

export default store;
