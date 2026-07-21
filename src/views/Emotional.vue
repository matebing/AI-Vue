<template>
  <div class="emotional-container">
    <PageHeader title="情绪日志" />
    <TableSearch
      :formItem="formItem"
      @search="handleSearch"
      class="emotional-search"
    />
    <el-table :data="tableData">
      <el-table-column label="用户ID" prop="id" width="80"></el-table-column>
      <el-table-column label="会话ID" width="80">
        <template #default="{ row }">
          <el-avatar>{{ row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="记录日期"
        prop="diaryDate"
        width="120"
      ></el-table-column>
      <el-table-column label="情绪评分" width="250">
        <template #default="{ row }">
          <el-rate :model-value="row.moodScore" :max="10" disabled></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="120">
        <template #default="{ row }">
          <div>
            <p>睡眠：{{ row.sleepQuality }} / 5</p>
            <p>压力：{{ row.stressLevel }} / 5</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="情绪触发因素"
        prop="emotionTriggers"
      ></el-table-column>
      <el-table-column label="日记内容" prop="diaryContent"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleDetail(row)"
            >详情</el-button
          >
          <el-button text type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="emotional-pagination"
      layout="prev, pager, next, total, sizes"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @current-change="currentChange"
      @size-change="sizeChange"
    ></el-pagination>
    <el-dialog
      title="情绪日志详情"
      v-model="detailVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentDetail" class="detail-content">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{
              currentDetail.username
            }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{
              currentDetail.nickname
            }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{
              currentDetail.id
            }}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{
              currentDetail.diaryDate
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <template #default>
                <el-rate
                  :model-value="currentDetail.moodScore"
                  :max="10"
                  disabled
                ></el-rate>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <template #default>
                <el-tag
                  :type="getEmotionTagType(currentDetail.dominantEmotion)"
                  >{{ currentDetail.dominantEmotion || "-" }}</el-tag
                >
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">
              {{ currentDetail.sleepQuality || "-" }} / 5
            </el-descriptions-item>
            <el-descriptions-item label="压力水平">
              {{ currentDetail.stressLevel || "-" }} / 5
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">
              {{ currentDetail.emotionTriggers || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="日记内容">
              {{ currentDetail.diaryContent || "-" }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>AI情绪分析结果</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="主要情绪">
              <el-tag
                :type="getAiEmotionTagType(aiEmotionDetail.primaryEmotion)"
                >{{ aiEmotionDetail.primaryEmotion }}</el-tag
              >
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress
                :percentage="aiEmotionDetail.emotionScore"
                :color="getEmotionScoreColor(aiEmotionDetail.emotionScore)"
                :stroke-width="8"
              ></el-progress>
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getAiEmotionTagType(aiEmotionDetail.riskLevel)">{{
                aiEmotionDetail.riskLevel
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag
                :type="aiEmotionDetail.isNegative ? 'danger' : 'success'"
                >{{ aiEmotionDetail.isNegative ? "负面" : "正面" }}</el-tag
              >
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="ai-suggestion-section">
          <h5>专业建议</h5>
          <div class="suggestion-content">
            {{ aiEmotionDetail.suggestion || "无" }}
          </div>
        </div>
        <div class="ai-risk-section">
          <h5>风险描述</h5>
          <div class="risk-content">
            {{ aiEmotionDetail.riskDescription || "无" }}
          </div>
        </div>
        <div class="ai-improvements-section">
          <h5>改善建议</h5>
          <ul class="improvement-list">
            <li v-for="item in improvementSuggestions" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="detail-section">
          <h5>时间信息</h5>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{
              aiEmotionDetail.createdAt
            }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{
              aiEmotionDetail.updatedAt
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import TableSearch from "@/components/TableSearch.vue";
import { getEmotionalList, deleteEmotional } from "@/api/admin";
import { ElMessageBox, ElMessage } from "element-plus";

const detailVisible = ref(false);

const formItem = [
  {
    comp: "input",
    prop: "userId",
    label: "用户ID",
    placeholder: "请输入用户ID",
  },
  {
    comp: "select",
    prop: "moodScoreRange",
    label: "情绪评分",
    placeholder: "请选择情绪评分",
    options: [
      {
        label: "低分（1-3）",
        value: "1-3",
      },
      {
        label: "中分（4-6）",
        value: "4-6",
      },
      {
        label: "高分（7-10）",
        value: "7-10",
      },
    ],
  },
];

const tableData = ref([]);

const currentDetail = ref(null);

const aiEmotionDetail = ref(null);

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    快乐: "success",
    平静: "info",
    兴奋: "warning",
    愤怒: "danger",
    悲伤: "info",
    焦虑: "warning",
  };
  return emotionTypes[emotion] || "info";
};

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    快乐: "success",
    平静: "success",
    兴奋: "warning",
    满足: "success",
    愤怒: "danger",
    悲伤: "info",
    焦虑: "warning",
    恐惧: "danger",
    沮丧: "info",
    压力: "warning",
  };
  return emotionTagMap[emotion] || "info";
};

const getEmotionScoreColor = (score) => {
  if (score >= 80) return "#f56c6c";
  if (score >= 60) return "#e6a23c";
  if (score >= 40) return "#909399";
  return "#67c23a";
};

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: "success",
    1: "info",
    2: "warning",
    3: "danger",
  };
  return riskTagMap[riskLevel] || "info";
};

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: "正常",
    1: "关注",
    2: "预警",
    3: "危机",
  };
  return riskTextMap[riskLevel] || "未知风险等级";
};

const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await getEmotionalList(params);
  tableData.value = records;
  pagination.total = total;
};

const currentChange = (val) => {
  pagination.currentPage = val;
  handleSearch({});
};

const sizeChange = (val) => {
  pagination.currentPage = 1;
  pagination.size = val;
  handleSearch({});
};

const handleDetail = (row) => {
  currentDetail.value = row;

  if (row.aiEmotionAnalysis) {
    aiEmotionDetail.value = JSON.parse(row.aiEmotionAnalysis);
    console.log("12312123", aiEmotionDetail.value);
  } else {
    aiEmotionDetail.value = {};
    console.log("12312123空", aiEmotionDetail.value);
  }

  detailVisible.value = true;
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除 ${row.id} 吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteEmotional(row.id).then((res) => {
      ElMessage.success("删除情绪成功");
      handleSearch();
    });
    console.log("删除");
  });
};

onMounted(() => {
  handleSearch({});
});
</script>
<style lang="scss" scoped>
.emotional-container {
  .emotional-search {
    margin-top: 20px;
  }
  .emotional-pagination {
    margin-top: 20px;
  }
  .detail-content {
    .detail-section {
      margin-bottom: 24px;

      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 16px;

        i {
          margin-right: 8px;
          color: #409eff;
        }
      }
    }

    .ai-keywords-section,
    .ai-suggestion-section,
    .ai-risk-section,
    .ai-improvements-section {
      margin-top: 16px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 4px;

      h5 {
        margin: 0 0 8px 0;
        color: #606266;
        font-size: 14px;
        font-weight: 600;

        i {
          margin-right: 6px;
          color: #909399;
        }
      }
    }
  }
}
</style>
