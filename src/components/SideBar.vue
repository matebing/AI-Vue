<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item
      v-for="(menu, index) in routes"
      :key="index"
      :index="menu.path"
    >
      <el-icon><component :is="menu.meta.icon" /></el-icon>
      <span>{{ menu.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const routes = router.options.routes[0].children;

const handleOpen = (key) => {};

const handleClose = () => {};

console.log("路由", useRoute(), "路由器", useRouter());
</script>
