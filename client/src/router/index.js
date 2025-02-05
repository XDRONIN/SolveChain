import { createRouter, createWebHistory } from "vue-router";
import Landing from "../components/Landing.vue";
import SignUp from "../components/SignUp.vue";

const routes = [
  { path: "/", component: Landing },
  { path: "/signUp", component: SignUp },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
