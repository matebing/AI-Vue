import { createRouter, createWebHashHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BackendLayout from "@/layouts/BackendLayout.vue";

// 后台系统路由
const backendRoutes = [
  {
    name: "AuthLayout",
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        name: "Login",
        path: "login",
        component: () => import("@/views/Login.vue"),
        meta: {
          title: "登录",
          icon: "Login",
        },
      },
      {
        name: "Register",
        path: "register",
        component: () => import("@/views/Register.vue"),
        meta: {
          title: "注册",
          icon: "Register",
        },
      },
    ],
  },
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
