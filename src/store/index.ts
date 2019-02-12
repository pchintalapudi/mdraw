import Vue from "vue";
import Vuex from "vuex";
import history from "./history";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: { theme: "standard" },
  mutations: {
    theme(state, newTheme: string) {
      state.theme = newTheme;
    }
  },
  modules: {
    history
  }
});

export default store;
