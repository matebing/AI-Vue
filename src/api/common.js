import service from "@/utils/request";

// 登录
export function login(data) {
  return service.post("/user/login", data);
}

// 退出登录
export function logout() {
  return service.post("/user/logout");
}

// 注册
export function register(data) {
  return service.post("/user/add", data);
}
