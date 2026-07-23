<template>
  <div class="ai-consult-container">
    <div class="side-bar">
      <!-- AI助手 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image
            :src="robotUrl"
            alt="AI助手"
            class="assistant-icon"
          ></el-image>
        </div>
        <h3 class="assistant-name">心理健康AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">中性</div>
          <div class="emotion-score">50</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{
              currentEmotion.isNegative ? "需要关注" : "很不错"
            }}</span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span
                v-for="dot in 3"
                :key="dot"
                :class="{
                  dot: true,
                  active: getEmotionCount(currentEmotion.emotionScore) >= dot,
                }"
              ></span>
              <span class="intensity-text">
                {{ getRiskText(currentEmotion.riskLevel) }}
                <!-- {{ getRiskText() }} -->
              </span>
            </span>
          </div>
          <!-- 温暖建议卡片 -->
          <div class="warm-suggestion" v-if="currentEmotion.suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          <!-- 治愈小行动 -->
          <div
            class="healing-actions"
            v-if="currentEmotion.improvementSuggestions.length > 0"
          >
            <div class="actions-title">治愈小行动</div>
            <div class="actions-list">
              <div
                v-for="action in currentEmotion.improvementSuggestions"
                :key="action"
                class="action-item"
              >
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div
            class="risk-notice"
            v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1"
          >
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">温馨提醒</div>
              <div class="notice-text">{{ currentEmotion.riskNotice }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 历史会话列表 -->
      <div class="session-history">
        <h4 class="section-title">会话列表</h4>
        <div class="session-list">
          <div
            v-for="session in sessionList"
            :key="session.id"
            class="session-item"
            @click="selectSession(session)"
          >
            <div class="session-info">
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ session.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon><ChatRound /></el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ session.durationMinutes || 0 }}分钟
                  </span>
                </div>
              </div>
              <!-- 删除按钮 -->
              <div class="session-actions">
                <el-button
                  type="danger"
                  text
                  size="mini"
                  @click="handleDelete(session)"
                  ><el-icon><DeleteFilled /></el-icon
                ></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image
              class="heart-icon"
              :src="heartUrl"
              alt="心型图片"
            ></el-image>
          </div>
          <div class="chat-info">
            <h2>AI助手</h2>
            <p>您贴心的AI助手</p>
          </div>
        </div>
        <el-button circle @click="initSession" title="新建会话"
          ><el-icon><Plus /></el-icon
        ></el-button>
      </div>
      <!-- 聊天消息区 -->
      <div class="chat-messages">
        <div v-if="messages.length === 0" class="message-item ai-message">
          <div class="message-avatar">
            <el-image :src="robotUrl" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>
                您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？
              </p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="{
            'message-item': true,
            'user-message': msg.senderType === 1,
            'ai-message': msg.senderType === 2,
          }"
        >
          <div class="message-avatar">
            <el-image
              v-if="msg.senderType === 1"
              :src="userUrl"
              style="width: 18px; height: 18px"
            ></el-image>
            <el-image
              v-else
              :src="robotUrl"
              style="width: 18px; height: 18px"
            ></el-image>
          </div>
          <div class="message-content">
            <div message-bubble>
              <!-- AI助手输入中指示器 -->
              <div
                v-if="msg.senderType === 2 && isAiTying && !msg.content"
                class="typing-indicator"
              >
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- AI错误提示 -->
              <div v-else-if="msg.isError" class="error-message">
                <p>{{ msg.content }}</p>
              </div>
              <!-- AI正常返回消息 -->
              <MarkdownRenderer
                v-else-if="msg.senderType === 2"
                :content="msg.content"
                :isAiMessage="true"
              ></MarkdownRenderer>
              <!-- 用户消息消息 -->
              <p
                v-else-if="msg.content"
                v-html="formatUserMessage(msg.content)"
              ></p>
            </div>
            <div class="message-tiem">
              {{
                msg.senderType === 2 && isAiTying
                  ? "正在输入中..."
                  : msg.createdAt
              }}
            </div>
          </div>
        </div>
      </div>
      <!-- 聊天输入区 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input
            v-model="userMessage"
            placeholder="请输入你想要分享的内容..."
            type="textarea"
            :rows="3"
            :disabled="isAiTying"
            @keydown="handleKeyDown"
            class="message-input"
            clearable
          />
          <div class="input-footer">
            <span>按Enter发送，Shift+Enter换行</span>
            <span>{{ userMessage.length }} / 500</span>
          </div>
        </div>
        <el-button
          :disabled="!userMessage.trim() || userMessage.length > 500"
          type="primary"
          class="send-btn"
          @click="sendMessage"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
//引入调用流式接口的方法，用于获取AI助手的流式回复，类似axios
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { ElMessage } from "element-plus";
import {
  startSession,
  getSessionList,
  deleteSession,
  getSessionMessages,
  getEmotionAnalysis,
} from "@/api/frontend";

//定义对话消息
const messages = ref([]);

//用户输入消息
const userMessage = ref("");

const isAiTying = ref(false);

//当前会话对象
const currentSession = ref(null);

//历史会话列表
const sessionList = ref([]);

//情绪花园
const currentEmotion = ref({
  primaryEmotion: "中性",
  emotionScore: 50,
  isNegative: false,
  riskLevel: "中",
  suggestion: "情绪状态平稳",
  improvementSuggestions: [],
});

const heartUrl = new URL("@/assets/images/like.png", import.meta.url).href;
const robotUrl = new URL("@/assets/images/robot-fill.png", import.meta.url)
  .href;
const userUrl = new URL("@/assets/images/users.png", import.meta.url).href;

const getEmotionCount = (score) => {
  if (score >= 61) {
    return 3;
  }
  if (score >= 31) {
    return 2;
  }
  return 1;
};

const getRiskText = (level) => {
  switch (level) {
    case 0:
      return "正常";
    case 1:
      return "关注";
    case 2:
      return "预警";
    case 3:
      return "危机";
    default:
      return "正常";
  }
};

//处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

//用户发送消息
const sendMessage = () => {
  if (!userMessage.value.trim()) {
    return;
  }
  if (isAiTying.value) {
    ElMessage.warning("AI助手正在输入中，请稍后");
    return;
  }
  const message = userMessage.value.trim();
  userMessage.value = "";
  //如果没有会话，或者临时会话，需要创建新的会话
  if (currentSession.value && currentSession.value.status === "TEMP") {
    startNewSession(message);
  } else {
    //继续现有会话
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString(),
    });
    startStreamingChat(currentSession.value.sessionId, message);
  }
};

const startNewSession = (message) => {
  //构建会话参数
  const sessionParams = {
    initialMessage: message,
  };
  if (currentSession.value.sessionTitle === "新对话") {
    sessionParams.sessionTitle = `AI助手-${new Date().toLocaleString()}`;
  } else {
    sessionParams.sessionTitle = currentSession.value.sessionTitle;
  }
  startSession(sessionParams).then((res) => {
    //将后端返回的会话对象转为前端会话格式
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle,
    };
    //如果当前是临时会话，需要更新数据
    if (currentSession.value && currentSession.value.status === "TEMP") {
      //更新为正式会话
      Object.assign(currentSession.value, sessionData);
    } else {
      // 否则创建新的会话
      currentSession.value = sessionData;
    }
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString(),
    });
    //更新历史会话列表
    querySessionList();
    //开始流式对话
    startStreamingChat(currentSession.value.sessionId, message);
  });
};

const startStreamingChat = (sessionId, userMessage) => {
  //防止重复发送
  if (isAiTying.value) {
    ElMessage.warning("AI助手正在回复中，请稍后");
    return;
  }
  isAiTying.value = true;
  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,
    content: "",
    createAt: new Date().toISOString(),
  };
  messages.value.push(aiMessage);

  //结束请求的方法
  //用来终止fetch请求的
  const ctrl = new AbortController();
  //调用流式接口
  fetchEventSource("/api/psychological-chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Token: localStorage.getItem("token"),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    signal: ctrl.signal,
    //处理流式响应
    onopen: (response) => {
      //检查响应头是否为流式数据
      if (response.headers.get("Content-Type") !== "text/event-stream") {
        ElMessage.error("服务器返回了非流式数据");
      }
    },
    //处理流式数据
    onmessage: (event) => {
      console.log("流式数据", event);
      const raw = event.data.trim();
      if (!raw) {
        return;
      }
      const eventName = event.event;
      // 获取当前会话的AI消息
      const aiMessage = messages.value[messages.value.length - 1];
      if (eventName === "done") {
        isAiTying.value = false;
        ctrl.abort();
        //查询情绪分析结果
        queryEmotionAnalysis(sessionId);
        //更新历史会话列表
        querySessionList();
        return;
      }
      const payload = JSON.parse(raw);
      const isSuccess = String(payload.code) === "200";
      if (isSuccess && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content;
      } else if (!isSuccess) {
        // 流式响应处理错误
        handleStreamingError(payload.message || "AI回复失败");
      }
    },
    //处理流式错误
    onerror: (error) => {
      isAiTying.value = false;
      handleStreamingError(error);
      throw error;
    },
    onclose: () => {
      // 开始情绪花园
      queryEmotionAnalysis(sessionId);
      //更新历史会话列表
      querySessionList();
    },
  });
};

const handleStreamingError = (error) => {
  const aiMessage = messages.value[messages.value.length - 1];
  if (aiMessage) {
    aiMessage.content = "AI回复失败，请稍后重试";
  }
  isAiTying.value = false;
  ElMessage.error("AI回复失败，请稍后重试");
};

//页面首次加载、点击新建会话按钮时调用
const initSession = () => {
  //创建新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: "TEMP",
    sessionTitle: "新对话",
  };
  //将新的会话对象赋值给currentSession
  currentSession.value = newSession;
};

const queryEmotionAnalysis = (sessionId) => {
  //确保sessionId格式正确
  const id = sessionId.toString().startsWith("session_")
    ? sessionId
    : `session_${sessionId}`;
  getEmotionAnalysis(id).then((res) => {
    currentEmotion.value = res;
    console.log("情绪状态", res);
  });
};

const querySessionList = () => {
  getSessionList({
    pageNum: 1,
    pageSize: 10,
  }).then((res) => {
    sessionList.value = res.records;
    console.log(res);
  });
};

//获取会话数据
const selectSession = (session) => {
  //查询会话消息列表
  getSessionMessages(session.id).then((res) => {
    messages.value = res;
  });
  //查询情绪分析结果
  queryEmotionAnalysis(session.id);
  //更新当前会话对象数据
  const sessionData = {
    sessionId: `session_${session.id}`,
    status: "ACTIVE",
    sessionTitle: session.sessionTitle,
  };
  currentSession.value = sessionData;
};

//删除会话
const handleDelete = (session) => {
  deleteSession(session.id).then(() => {
    ElMessage.success("会话删除成功");
    //更新历史会话列表
    querySessionList();
  });
};

//格式化用户信息
const formatUserMessage = (message) => {
  return message.replace(/\n/g, "<br>");
};

onMounted(() => {
  //初始化时创建新的会话
  initSession();
  //查询历史会话列表
  querySessionList();
});
</script>
<style lang="scss" scoped>
.ai-consult-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;
  .side-bar {
    width: 320px;
    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 252, 248, 0.95) 100%
      );
      border-radius: 16px;
      padding: 16px;
      box-shadow:
        0 8px 32px rgba(251, 146, 60, 0.06),
        0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
        .assistant-icon {
          width: 25px;
          height: 25px;
        }
      }
      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }
      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }
    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }
          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }
          .session-info {
            flex: 1;
            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }
              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;
                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }
            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }
        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .emotion-garden {
      background: linear-gradient(
        135deg,
        #fef9e7 0%,
        #fcf4e6 50%,
        #f6f0e8 100%
      );
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }
      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(
          135deg,
          #ff9a9e 0%,
          #fecfef 50%,
          #fecfef 100%
        );
        color: #fff;
        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }
        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }
      .warm-tips {
        text-align: center;
        margin-bottom: 16px;
        .emotion-status-text {
          margin-bottom: 12px;
          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }
          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }
        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          .intensity-dots {
            display: flex;
            gap: 4px;
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;
              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }
          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }
        .warm-suggestion {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.8)
          );
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .suggestion-content {
            text-align: left;
            flex: 1;
            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }
            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }
        .healing-actions {
          margin-bottom: 16px;
          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }
          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .action-item {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9),
                rgba(255, 255, 255, 0.7)
              );
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;
              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }
              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }
        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .notice-content {
            flex: 1;
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }
            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  .chat-main {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 252, 250, 0.98) 100%
    );
    border-radius: 20px;
    box-shadow:
      0 12px 40px rgba(251, 146, 60, 0.08),
      0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
      .header-left {
        display: flex;
        align-items: center;
        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
          .heart-icon {
            width: 30px;
            height: 30px;
          }
        }
        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.02) 0%,
        rgba(255, 252, 248, 0.05) 100%
      );
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }
        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }
        .message-content {
          max-width: 70%;
          .message-bubble {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 252, 248, 0.95) 100%
            );
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
              border: 1px solid #f87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991b1b;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }
    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 252, 248, 0.7) 100%
      );
      backdrop-filter: blur(10px);
      flex-shrink: 0;
      .input-container {
        flex: 1;
      }
      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }
      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: 16px;
        background: linear-gradient(
          135deg,
          #fb923c 0%,
          #f59e0b 100%
        ) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
