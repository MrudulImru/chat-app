import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/",
      name: "chat",
      component: () => import("../views/ChatView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next({ name: "login" });
//   } else {
//     next();
//   }
// });

export default router;
