<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="brandLogo" alt="品牌logo" class="brand-logo"></el-image>
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/frontend" class="nav-link">首页</router-link>
        <router-link
          v-if="isLogin"
          to="/frontend/aiConsultation"
          class="nav-link"
          >AI咨询</router-link
        >
        <router-link
          v-if="isLogin"
          to="/frontend/emotion-diary"
          class="nav-link"
          >情绪日记</router-link
        >
        <router-link to="/frontend/knowledge" class="nav-link"
          >知识库</router-link
        >
        <el-button
          v-if="isLogin"
          text
          size="medium"
          class="logout-btn"
          @click="handleLogout"
        >
          退出登录</el-button
        >
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-container">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { logout } from "@/api/common";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const brandLogo = new URL("@/assets/images/机器人.png", import.meta.url).href;
const isLogin = ref(false);

const handleLogout = () => {
  ElMessageBox.confirm("确定退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    logout().then(() => {
      ElMessage.success("已退出登录");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      router.push("/auth/login");
    });
  });
};

onMounted(() => {
  isLogin.value = localStorage.getItem("token") !== null;
});
</script>
<style lang="scss" scoped>
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
      .brand-logo {
        width: 50px;
        height: 50px;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
