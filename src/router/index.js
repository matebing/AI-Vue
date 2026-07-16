import { createRouter, createWebHashHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";

// 后台系统路由
const backendRoutes = [
  {
    name: "back",
    path: "/back",
    component: BackendLayout,
    children: [
      {
        name: "dashboard",
        path: "dashboard",
        component: () => import("@/views/dashboard.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...backendRoutes],
});

export default router;
