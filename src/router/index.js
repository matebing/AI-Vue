import { createRouter, createWebHashHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";

// 后台系统路由
const backendRoutes = [
  {
    name: "BackendLayout",
    path: "/back",
    component: BackendLayout,
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        name: "Knowledge",
        path: "knowledge",
        component: () => import("@/views/Knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        name: "Consultations",
        path: "consultations",
        component: () => import("@/views/Consultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        name: "Emotional",
        path: "emotional",
        component: () => import("@/views/Emotional.vue"),
        meta: {
          title: "情感分析",
          icon: "User",
        },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...backendRoutes],
});

export default router;
