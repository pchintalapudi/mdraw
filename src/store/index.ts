import Vue from "vue";
import Vuex from "vuex";
import history from "./history";
import molecules from "./molecules";
import files from "./files";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: { theme: "standard", clickTime: 500 },
  mutations: {
    theme(state, newTheme: string) {
      state.theme = newTheme;
    }
  },
  modules: {
    history,
    molecules,
    files
  }
});

export default store;
