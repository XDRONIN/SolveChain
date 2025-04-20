import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import SignUp from "../views/SignUp.vue";
import Dashboard from "../views/Dashboard.vue";
import AdminDash from "../views/admin/AdminDash.vue";

const routes = [
  { path: "/", component: Landing },
  { path: "/signUp", component: SignUp },
  { path: "/dashboard", component: Dashboard },
  { path: "/adminDashboard", component: AdminDash },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
