<template>
  <div class="knowledge-container">
    <PageHeader title="知识文档">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHeader>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="articleList" class="knowledge-table">
      <el-table-column label="文章标题" fixed="left">
        <template #default="{ row }">
          <div class="table-item">
            <el-icon><Timer /></el-icon>
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="{ row }">
          <div class="table-item">
            <el-icon><Timer /></el-icon>
            <span>{{ categoryMap[row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        prop="authorName"
        width="150"
      ></el-table-column>
      <el-table-column
        label="阅读量"
        prop="readCount"
        width="150"
      ></el-table-column>
      <el-table-column
        label="发布时间"
        prop="updatedAt"
        width="150"
      ></el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            v-if="[0, 2].includes(row.status)"
            text
            type="success"
            @click="handlePublish(row)"
            >发布</el-button
          >
          <el-button
            v-if="[1].includes(row.status)"
            text
            type="warning"
            @click="handleOffline(row)"
            >下线</el-button
          >
          <el-button text type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="knowledge-pagination"
      layout="prev, pager, next, total, sizes"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @current-change="currentChange"
      @size-change="sizeChange"
    ></el-pagination>
    <!-- v-model:modelValue可以隐式的向子组件传递一个v-on:update:modelValue事件 -->
    <!-- 相当于：v-bind:modelValue="addDialogVisible" v-on:update:modelValue="addDialogVisible = $event" -->
    <!-- 相当于：:modelValue="addDialogVisible" @update:modelValue="addDialogVisible = $event"  -->
    <ArticleDialog
      title="文章标题"
      v-model:modelValue="addDialogVisible"
      :categoryList="categoryList"
      :articleDetail="articleDetail"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup>
import PageHeader from "@/components/PageHeader.vue";
import TableSearch from "@/components/TableSearch.vue";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import {
  getCategoryList,
  getArticleList,
  getArticleDetail,
  publishArticle,
  offlineArticle,
  deleteArticle,
} from "@/api/admin";

const addDialogVisible = ref(false);

const articleDetail = ref({});

const formItem = [
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "categoryId",
    label: "分类",
    placeholder: "请选择分类",
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请选择状态",
    options: [
      {
        label: "草稿",
        value: "0",
      },
      {
        label: "已发布",
        value: "1",
      },
      {
        label: "已下线",
        value: "2",
      },
    ],
  },
];

// 分类映射
const categoryMap = reactive({});

// 分类列表
// ref 适用于基本类型，也可以用于对象数组(当需要 整体替换 数组/对象时， ref 是更合适的选择)
// ref 可以直接整体替换对象/数组，而reactive不能整体替换(会丢失响应式)，只能修改对象的属性
const categoryList = ref([]);

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const articleList = ref([]);

const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await getArticleList(params);
  articleList.value = records;
  pagination.total = total;
};

const queryCategoryList = async () => {
  const data = await getCategoryList();
  categoryList.value = data.map((item) => {
    categoryMap[item.id] = item.categoryName;
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  formItem[1].options = categoryList.value;
};

const currentChange = (val) => {
  pagination.currentPage = val;
  handleSearch();
};

const sizeChange = (val) => {
  pagination.currentPage = 1;
  pagination.size = val;
  handleSearch();
};

const handleEdit = (row) => {
  if (row.id) {
    getArticleDetail(row.id).then((res) => {
      articleDetail.value = res;
      addDialogVisible.value = true;
    });
  } else {
    articleDetail.value = null;
    addDialogVisible.value = true;
  }
};

const handleSuccess = () => {
  pagination.currentPage = 1;
  handleSearch();
};

const handlePublish = (row) => {
  ElMessageBox.confirm(`确定发布 ${row.title} 吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    publishArticle(row.id, { status: 1 }).then((res) => {
      ElMessage.success(res.message || "发布文章成功");
      handleSearch();
    });
  });
};

const handleOffline = (row) => {
  ElMessageBox.confirm(`确定下线 ${row.title} 吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    offlineArticle(row.id, { status: 2 }).then((res) => {
      ElMessage.success(res.message || "下线文章成功");
      handleSearch();
    });
  });
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除 ${row.title} 吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteArticle(row.id).then((res) => {
      ElMessage.success("删除文章成功");
      handleSearch();
    });
    console.log("删除");
  });
};

onMounted(() => {
  queryCategoryList();
  handleSearch();
});
</script>
<style lang="scss" scoped>
.knowledge-container {
  .knowledge-table {
    width: 100%;
    margin-top: 25px;
    .table-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .knowledge-pagination {
    margin-top: 25px;
  }
}
</style>
