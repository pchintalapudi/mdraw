import Vue from "vue";
import App from "./App.vue";
import Router from "./router";
import Store from "./store";

new Vue({
  el: "#app",
  router: Router,
  components: { App },
  template: "<App />",
  store: Store
});
