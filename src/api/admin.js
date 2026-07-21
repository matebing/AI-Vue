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

// 文章详情
export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`);
}

// 编辑文章
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data);
}

//发布文章
export function publishArticle(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data);
}

//下线文章
export function offlineArticle(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data);
}

//删除文章
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`);
}

// 咨询记录列表
export function getConsultationsList(params) {
  return service.get("/psychological-chat/sessions", { params });
}

// 咨询记录详情
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
}

// 情绪日志列表
export function getEmotionalList(params) {
  return service.get("/emotion-diary/admin/page", { params });
}

// 删除情绪日志
export function deleteEmotional(id) {
  return service.delete(`/emotion-diary/admin/${id}`);
}

// 获取数据分析看板数据
export function getAnalysisOverview() {
  return service.get("/data-analytics/overview ");
}
