import Vue from "vue";
import Drawer from "./components/Drawer.vue";
import "./registerServiceWorker";

const _ = new Vue({
  render: (h) => h(Drawer),
}).$mount("#app");
