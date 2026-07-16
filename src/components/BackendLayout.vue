<template>
  <div class="backend-layout">
    <el-container>
      <SideBar />
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
}
</style>
