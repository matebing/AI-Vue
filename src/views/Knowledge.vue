<template>
  <div class="knowledge-container">
    <PageHeader title="知识文档">
      <template #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHeader>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="articleList" class="knowledge-table">
      <el-table-column label="文章标题" width="200">
        <template #default="{ row }">
          <div class="table-item">
            <el-icon><Timer /></el-icon>
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import PageHeader from "@/components/PageHeader.vue";
import TableSearch from "@/components/TableSearch.vue";
import { onMounted, reactive, ref } from "vue";
import { getCategoryList, getArticleList } from "@/api/admin";

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
}
</style>
