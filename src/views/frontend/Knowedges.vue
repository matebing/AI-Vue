<template>
  <div class="knowledges-container">
    <div class="header-section">
      <div class="header-content">
        <el-image
          :src="bookUrl"
          alt="知识库图标"
          style="width: 60px; height: 60px"
        ></el-image>
        <h1>知识库</h1>
      </div>
    </div>
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div
            v-for="item in recommendList"
            :key="item.id"
            class="recommend-item"
            @click="goToArticleDetail(item)"
          >
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon><Histogram /></el-icon>
              阅读量 {{ item.readCount }}
            </p>
          </div>
        </div>
      </div>
      <!-- 右侧文章列表 -->
      <div class="article-list">
        <div
          v-for="item in articleList"
          :key="item.id"
          class="article-item"
          @click="goToArticleDetail(item)"
        >
          <el-image
            :src="getImage(item.coverImage)"
            style="width: 240px; height: 150px"
          ></el-image>
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon><Avatar /></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon><List /></el-icon>
                <span>{{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}</span>
              </div>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon><Platform /></el-icon>
                <span>观看人数{{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        layout="prev, pager, next, total, sizes"
        :total="pagination.total"
        :page-size="pagination.size"
        :current-page="pagination.currentPage"
        @current-change="currentChange"
        @size-change="sizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { getKnowledgeList, getArticleList } from "@/api/frontend";
import { FILE_BASE_URL } from "@/config/index.js";
import { bookUrl } from "@/assets/index.js";

const router = useRouter();

const recommendList = ref([]);

const articleList = ref([]);

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const goToArticleDetail = (item) => {
  // router.push(`/frontend/knowledges/articleDetail/${item.id}`);
  router.push({
    name: "ArticleDetail",
    params: {
      id: item.id,
    },
  });
  console.log(item);
};

const getImage = (url) => {
  return url
    ? FILE_BASE_URL + url
    : "https://file.itndedu.com/psychology_ai.png";
};

const queryKnowledgeList = () => {
  const params = {
    sortField: "readCount",
    sortDirection: "desc",
    currentPage: 1,
    size: 5,
  };
  getKnowledgeList(params).then((res) => {
    recommendList.value = res.records;
  });
};

const queryArticleList = () => {
  const params = {
    sortField: "publishedAt",
    sortDirection: "desc",
    ...pagination,
  };
  getArticleList(params).then((res) => {
    articleList.value = res.records;
  });
};

const currentChange = (val) => {
  pagination.currentPage = val;
  queryArticleList();
};

const sizeChange = (val) => {
  pagination.currentPage = 1;
  pagination.size = val;
  queryArticleList();
};

onMounted(() => {
  queryKnowledgeList();
  queryArticleList();
});
</script>

<style lang="scss" scoped>
.knowledges-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  .flex-box {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  .header-section {
    background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;
    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  .content {
    display: flex;
    gap: 20px;
    margin: 0 auto;
    width: 1200px;
    padding: 20px;
    .recommend-section {
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 400px;
      .section-title {
        font-size: 12;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .recommend-item {
          border-left: 4px solid #f59e0b;
          padding-left: 10px;
          cursor: pointer;
          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
    .article-list {
      flex: 1;
      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        .info {
          margin-left: 20px;
          .title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>
