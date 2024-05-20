import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ExprementView from "../views/ExprementView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/exprement",
      name: "exprement",
      component: ExprementView,
    },
  ],
});

export default router;
