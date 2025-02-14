import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import SignUp from "../views/SignUp.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", component: Landing },
  { path: "/signUp", component: SignUp },
  { path: "/dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
