import service from "@/utils/request";

//开启新的会话
export const startSession = (data) => {
  return service.post("/psychological-chat/session/start", data);
};

//获取历史会话列表
export const getSessionList = (params) => {
  return service.get("/psychological-chat/sessions", { params });
};

//删除会话
export const deleteSession = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`);
};

//获取会话消息列表
export const getSessionMessages = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
};

//获取情绪分析结果
export const getEmotionAnalysis = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`);
};

//提交情绪日记
export const createEmotionDiary = (data) => {
  return service.post("/emotion-diary", data);
};

//查询知识库推荐阅读列表
export const getKnowledgeList = (params) => {
  console.log("参数", params);
  return service.get("/knowledge/article/page", { params });
};

//查询知识库列表
export const getArticleList = (params) => {
  return service.get("/knowledge/article/page", { params });
};

//查询文章详情
export const getArticleDetail = (articleId) => {
  return service.get(`/knowledge/article/${articleId}`);
};
