import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import SignUp from "../views/SignUp.vue";

const routes = [
  { path: "/", component: Landing },
  { path: "/signUp", component: SignUp },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
