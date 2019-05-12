import Vue from "vue";
import Drawer from "./components/Drawer.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Drawer),
}).$mount("#app");
