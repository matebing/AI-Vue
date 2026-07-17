<template>
  <el-menu default-active="2" class="side-menu">
    <div class="brand">
      <el-image class="brand-logo" :src="iconUrl"></el-image>
      <div class="brand-info">
        <h1 class="brand-title">心理健康AI助手</h1>
        <p class="brand-subtitle">管理后台</p>
      </div>
    </div>
    <el-menu-item
      v-for="(menu, index) in routes"
      :key="index"
      :index="menu.path"
      @click="selectMenu"
    >
      <el-icon><component :is="menu.meta.icon" /></el-icon>
      <span>{{ menu.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const { children: routes, path } = router.options.routes[0];

//获取图片路径，需要确保打包之后的路径正确，否则会报错
const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;
const selectMenu = (key) => {
  const activeUrl = `${path}/${key.index}`;
  router.push(activeUrl);
  console.log(activeUrl);
};

console.log("路由", useRoute(), "路由器", useRouter());
</script>

<style lang="scss" scoped>
.side-menu {
  height: 100%;
  .brand {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e5e7eb;
    .brand-logo {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .brand-info {
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
      }
      .brand-subtitle {
        font-size: 14px;
        font-weight: normal;
        color: #6b7280;
      }
    }
  }
}
</style>
