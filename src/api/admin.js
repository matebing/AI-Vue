import service from "@/utils/request";

// 登录
export function login(data) {
  return service.post("/user/login", data);
}

// 分类列表
export function getCategoryList() {
  return service.get("/knowledge/category/tree");
}

// 文章列表
export function getArticleList(params) {
  return service.get("/knowledge/article/page", { params });
}
