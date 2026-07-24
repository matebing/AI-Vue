<template>
  <div class="emotionDiary-container">
    <div class="header-section">
      <div class="header-content">
        <el-image
          :src="heartUrl"
          alt="like-icon"
          style="width: 60px; height: 60px"
        ></el-image>
        <h1>情绪日记</h1>
      </div>
    </div>
    <div class="content">
      <!-- 情绪评分 -->
      <div class="diary-card">
        <div class="title">今日情绪评分</div>
        <div class="section">
          <p>您今天的整体情绪状态如何？（1-10分）</p>
          <div class="rate">
            <el-rate
              v-model="diaryForm.moodScore"
              :texts="emotionStatus"
              show-text
              :max="10"
              size="large"
            ></el-rate>
          </div>
        </div>
      </div>
      <!-- 主要情绪 -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <div class="emotion-grid">
          <div
            v-for="emotion in emotionOptions"
            :key="emotion.name"
            :class="{
              'emotion-card': true,
              selected: emotion.name === diaryForm.dominantEmotion,
            }"
            @click="selectEmotion(emotion.name)"
          >
            <el-image
              :src="emotion.url"
              style="width: 50px; height: 50px"
            ></el-image>
            <div class="emotion-name">{{ emotion.name }}</div>
          </div>
        </div>
      </div>
      <!-- 详细记录 -->
      <div class="diary-card">
        <div class="title">详细记录</div>
        <div class="detail-form">
          <div class="form-group">
            <div class="form-label">情绪触发因素</div>
            <el-input
              v-model="diaryForm.emotionTriggers"
              placeholder="今天什么事情影响了您的情绪？"
              type="textarea"
              :rows="3"
              :maxlength="1000"
              show-word-limit
            ></el-input>
          </div>
          <div class="form-group">
            <div class="form-label">今日感想</div>
            <el-input
              v-model="diaryForm.diaryContent"
              placeholder="写下您今天的想法，感受或发生的有趣事情..."
              type="textarea"
              :rows="5"
              :maxlength="2000"
              show-word-limit
            ></el-input>
          </div>
          <!-- 生活指标 -->
          <div class="life-indicators">
            <div class="indicator-group">
              <div class="indicator-label">睡眠质量</div>
              <el-select
                v-model="diaryForm.sleepQuality"
                placeholder="请选择睡眠质量"
              >
                <el-option
                  v-for="quality in sleepQualitys"
                  :key="quality.value"
                  :label="quality.label"
                  :value="quality.value"
                ></el-option>
              </el-select>
            </div>
            <div class="indicator-group">
              <div class="indicator-label">压力水平</div>
              <el-select
                v-model="diaryForm.stressLevel"
                placeholder="请选择压力水平"
              >
                <el-option
                  v-for="level in stressLevels"
                  :key="level.value"
                  :label="level.label"
                  :value="level.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- 功能按钮 -->
          <div class="action-buttons">
            <el-button @click="resetForm">提交日志</el-button>
            <el-button type="primary" @click="submitDiary">提交日志</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import { dayjs, ElMessage } from "element-plus";
import { createEmotionDiary } from "@/api/frontend.js";
import {
  emotionStatus,
  emotionOptions,
  sleepQualitys,
  stressLevels,
} from "@/views/const.js";
import { heartUrl } from "@/assets/index.js";

const diaryForm = reactive({
  diaryContent: "",

  diaryDate: dayjs().format("YYYY-MM-DD"),

  dominantEmotion: "",

  emotionTriggers: "",

  moodScore: null,

  sleepQuality: null,

  stressLevel: null,
});

const selectEmotion = (name) => {
  diaryForm.dominantEmotion = name;
};

const resetForm = () => {
  Object.assign(diaryForm, {
    diaryContent: "",
    emotionTriggers: "",
    moodScore: null,
    sleepQuality: null,
    stressLevel: null,
    dominantEmotion: "",
    diaryDate: dayjs().format("YYYY-MM-DD"),
  });
};

const submitDiary = () => {
  console.log("情绪日记", diaryForm);
  if (!diaryForm.moodScore) {
    ElMessage.error("请选择情绪评分");
    return;
  }
  createEmotionDiary(diaryForm).then((res) => {
    ElMessage.success("情绪日记提交成功");
    // resetForm();
  });
};
</script>
<style lang="scss" scoped>
.emotionDiary-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  .header-section {
    background: linear-gradient(135deg, #7ed321 0%, #f5a623 100%);
    color: white;
    padding: 48px;
    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  .content {
    margin: 0 auto;
    width: 980px;
    padding: 20px;
    .diary-card {
      margin-bottom: 20px;
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      .title {
        margin-bottom: 20px;
        font-size: 25px;
        font-weight: 600;
        color: #374151;
      }
      .section {
        margin-bottom: 20px;
        p {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 15px;
        }
      }
      .emotion-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        .emotion-card {
          padding: 15px;
          border: 2px solid #e5e7eb;
          border-radius: 15px;
          text-align: center;
          cursor: pointer;
          background: #f9fafb;
          .emotion-name {
            margin-top: 10px;
            padding: 0 75px;
            color: #374151;
          }
          &.selected {
            border-color: #7ed321;
            background: #f0fdf4;
            transform: translateY(-3px);
          }
        }
      }
      .detail-form {
        .form-label {
          margin: 10px 0;
          color: #374151;
        }
        .life-indicators {
          display: flex;
          gap: 20px;
          .indicator-group {
            flex: 1;
          }
        }
        .action-buttons {
          margin-top: 40px;
        }
      }
    }
  }
}
</style>
