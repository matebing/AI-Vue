import { createRouter, createWebHashHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import BackendLayout from "@/layouts/BackendLayout.vue";
import FrontendLayout from "@/layouts/FrontendLayout.vue";

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
    redirect: "/back/dashboard",
    component: BackendLayout,
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        component: () => import("@/views/backend/Dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        name: "Knowledge",
        path: "knowledge",
        component: () => import("@/views/backend/Knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        name: "Consultations",
        path: "consultations",
        component: () => import("@/views/backend/Consultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        name: "Emotional",
        path: "emotional",
        component: () => import("@/views/backend/Emotional.vue"),
        meta: {
          title: "情感分析",
          icon: "User",
        },
      },
    ],
  },
];
// 前台系统路由
const frontendRoutes = [
  {
    name: "FrontendLayout",
    path: "/frontend",
    redirect: "/frontend/home",
    component: FrontendLayout,
    children: [
      {
        name: "Home",
        path: "home",
        component: () => import("@/views/frontend/Home.vue"),
      },
      {
        name: "Consultation",
        path: "consultation",
        component: () => import("@/views/frontend/Consultation.vue"),
      },
      {
        name: "EmotionDiary",
        path: "emotion-diary",
        component: () => import("@/views/frontend/EmotionDiary.vue"),
      },
      {
        name: "Knowledges",
        path: "knowledges",
        component: () => import("@/views/frontend/Knowedges.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
});

// 路由前置守卫，路由跳转之前处理
// router.beforeEach((to, from, next) => {
//   // 检查用户是否登录
//   const token = localStorage.getItem("token");
//   // 当前用户是否登录
//   if (token) {
//     //
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     if (userInfo.userType == 2) {
//       // 后台用户
//       if (to.path.startsWith("/back")) {
//         next();
//       } else {
//         next("/back/dashboard");
//       }
//     } else if (userInfo.userType == 1) {
//       // 前台用户(用户端账号)只能访问前台路由
//       if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
//         next("/");
//       } else {
//         next();
//       }
//     }
//   } else {
//     // 需要区分是前台页面还是后台页面，前台系统未登录的情况下也能访问个别页面，后台系统未登录的情况下不能访问任何业务页面，只能访问登录、注册页面
//     if (to.path.startsWith("/back")) {
//       // 后台系统未登录的情况下不能访问任何业务页面，只能访问登录、注册页面
//       next({ name: "Login" });
//       // next("/auth/login");
//     } else {
//       // 前台系统未登录的情况下也能访问个别页面
//       next();
//     }
//   }
// });

export default router;
