<template>
  <div class="consultations-container">
    <PageHeader title="咨询记录"></PageHeader>
    <el-table :data="tableData" class="consultations-table">
      <el-table-column label="会话ID" width="100">
        <template #default="{ row }">
          <el-avatar>{{ row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="{ row }">
          <div class="session-title">{{ row.sessionTitle }}</div>
          <div class="session-preview">{{ row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="消息数"
        prop="messageCount"
        width="100"
      ></el-table-column>
      <el-table-column
        label="时间"
        prop="lastMessageTime"
        width="200"
      ></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" text @click="viewDetail(row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, total, sizes"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @current-change="currentChange"
      @size-change="sizeChange"
    ></el-pagination>
    <el-dialog
      v-model="detailVisible"
      title="资讯会话详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">
              {{ sessionHeaderDetail.userNickname }}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">
              {{ sessionHeaderDetail.startedAt }}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">
              {{ sessionHeaderDetail.messageCount }}
            </div>
          </div>
        </div>
        <div class="detail-content">
          <div class="message-header">
            <h4>对话记录</h4>
          </div>
          <div class="message-list" v-loading="loading">
            <div
              v-for="session in sessionContentDetail"
              :key="session.id"
              class="session-item"
              :class="session.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="session-header">
                <span class="sender">{{
                  session.senderType === 1 ? "用户" : "AI助手"
                }}</span>
                <span class="time">{{ session.createdAt }}</span>
              </div>
              <div class="session-content">{{ session.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import { getConsultationsList, getSessionDetail } from "@/api/admin";

const loading = ref(false);

const tableData = ref([]);

const sessionHeaderDetail = ref({});

const sessionContentDetail = ref([]);

const detailVisible = ref(false);

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const currentChange = (val) => {
  pagination.currentPage = val;
  queryConsultationsList();
};

const sizeChange = (val) => {
  pagination.currentPage = 1;
  pagination.size = val;
  queryConsultationsList();
};

const queryConsultationsList = () => {
  const params = {
    ...pagination,
    emotionTag: "",
  };
  getConsultationsList(params).then((res) => {
    console.log("咨询记录列表", res);
    const { records, total } = res;
    tableData.value = records || [];
    pagination.total = total;
  });
};

const viewDetail = (row) => {
  detailVisible.value = true;
  loading.value = true;
  getSessionDetail(row.id)
    .then((res) => {
      sessionHeaderDetail.value = row;
      sessionContentDetail.value = res || [];
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    });

  console.log("查看详情", row);
};

onMounted(() => {
  queryConsultationsList();
});
</script>
<style lang="scss" scoped>
.consultations-container {
  .consultations-table {
    width: 100%;
    margin-top: 25px;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        :last-child {
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 500;
          color: #495057;
          min-width: 80px;
          margin-right: 8px;
        }
        .detail-value {
          color: #333;
        }
      }
    }
    .detail-content {
      margin-top: 20px;
      .message-header {
        margin-bottom: 16px;
        h4 {
          margin: 0;
          color: #333;
          font-size: 16px;
          font-weight: 500;
        }
      }
      .message-list {
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 16px;
        background: #fff;
        .session-item {
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          :last-child {
            margin-bottom: 0;
          }
          &.user-message {
            background: #e8f4fd;
          }

          &.ai-message {
            background: #f0f9f0;
          }

          .session-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            .sender {
              font-weight: 500;
              color: #333;
              display: flex;
              align-items: center;
              gap: 4px;
            }

            .time {
              font-size: 12px;
              color: #999;
            }
          }

          .session-content {
            color: #333;
            line-height: 1.6;
            white-space: pre-wrap;
            margin-top: 8px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
