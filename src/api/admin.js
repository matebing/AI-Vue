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

//上传封面
export function uploadCover(file, businessId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessType", "ARTICLE");
  formData.append("businessId", businessId);
  formData.append("businessField", "cover");

  return service.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 编辑、新增文章
export function createArticle(data) {
  return service.post("/knowledge/article", data);
}
