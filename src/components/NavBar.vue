<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button>
        <el-icon><Expand /></el-icon>
      </el-button>
      <span class="page-title">导航栏</span>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
const handleCommand = (command) => {
  console.log(command);
  if (command === "logout") {
    // 退出登录逻辑
  }
};
</script>
<style lang="scss" scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 15px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.88);
  border-bottom: 1px solid #e5e7eb;

  .flex-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .page-title {
      font-size: 26px;
      font-weight: bold;
      color: #1f2937;
      margin-left: 20px;
    }
  }
}
</style>
