import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

//创建axios实例
const service = axios.create({
  baseURL: "/api", // 请求基础路径
  timeout: 5000, // 请求超时时间
});

//创建请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 从localStorage获取token，添加到请求头中
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//创建响应拦截器
service.interceptors.response.use(
  // 接口请求成功，http状态码=200
  (response) => {
    const { data, config } = response;
    //接口请求状态码：Headers中的Status Code:200是接口请求状态码，200表示接口请求成功，是网络请求自带的状态码
    //业务状态码：是业务层的状态码，响应数据中的code是后端返回的业务状态码，200表示业务请求成功，非200可能是数据异常，需要处理。需要跟接口请求状态码分开
    if (data.code === "200") {
      return data.data;
    }
    // 接口请求成功，但是业务请求失败，code=-1表示登录过期
    if (data.code === "-1") {
      //
      if (!config.url?.includes("/login")) {
        ElMessage.error("登录过期，请重新登录");
        // 清除localStorage中的过期token、用户信息
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        // 返回登录页
        window.location.href = "/auth/login";
      }
    // 接口请求成功，但是业务请求失败，code!=200表示数据异常
    } else {
      ElMessage.error(data.msg || "网络请求失败");
      return Promise.reject(data.msg || "网络请求失败");
    }
  },

  // 接口请求失败(网络错误、超时、4xx、5xx)，http状态码!=200
  (error) => {
    return Promise.reject(error);
  },
);

export default service;
