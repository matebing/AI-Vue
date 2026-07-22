<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>输入您的登录信息</p>
      </div>
    </div>
    <div class="account-form">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
            size="large"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button
          class="login-btn"
          type="primary"
          size="large"
          @click="handleLogin(formRef)"
          >登录账户</el-button
        >
        <div class="register-btn">
          <p>
            还没有账户？<router-link to="/auth/register">去注册</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { login } from "@/api/common";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const formRef = ref(null);
const router = useRouter();
const formData = reactive({
  username: "",
  password: "",
});
const formRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const handleLogin = async (formEl) => {
  console.log("表单", formEl);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    console.log("验证结果", valid, fields);
    if (valid) {
      login(formData).then((res) => {
        // 判断token是否存在
        if (!res.token) {
          ElMessage.error("登录失败");
        }
        // 登录成功
        localStorage.setItem("token", res.token);
        localStorage.setItem("userInfo", JSON.stringify(res.userInfo));
        ElMessage.success("登录成功");
        //根据用户角色决定跳转的路径
        if (res.roleType === "2") {
          router.push("/back/dashboard");
        } else {
          // 普通用户跳转首页
          router.push({ name: "Home" });
        }
      });
    }
  });
};
</script>
<style lang="scss" scoped>
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 60px;
    }
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .account-form {
    margin-top: 30px;
    .footer {
      margin-top: 40px;
      .login-btn {
        width: 100%;
      }
      .register-btn {
        padding: 30px;
        text-align: center;
      }
    }
  }
}
</style>
