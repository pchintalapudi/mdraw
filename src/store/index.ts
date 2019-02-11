import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: { theme: "standard" },
  mutations: {
    theme({ theme }, newTheme: string) {
      theme = newTheme;
    }
  }
});

export default store;