import Vue from "vue";
import Router from "vue-router";
import Container from "../components/drawer/Container.vue";
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [{ path: "/", component: Container }]
});

export default router;
