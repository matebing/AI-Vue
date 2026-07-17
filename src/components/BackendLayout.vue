<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <el-aside width="264px">
        <SideBar />
      </el-aside>
      <el-container>
        <el-header>
          <NavBar />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import SideBar from "./SideBar.vue";
import NavBar from "./NavBar.vue";
</script>
<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container {
    height: 100%;
  }
}
</style>
