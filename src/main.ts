import Vue from "vue";
import Drawer from "./components/Drawer.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;

const vue = new Vue({
  render: (h) => h(Drawer),
}).$mount("#app");
