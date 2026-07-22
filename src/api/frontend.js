import service from "@/utils/request";

// 开启新的会话
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
