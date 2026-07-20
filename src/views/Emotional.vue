<template>
  <div class="emotional-container">
    <PageHeader title="情绪日志" />
    <TableSearch
      :formItem="formItem"
      @search="handleSearch"
      class="emotional-search"
    />
    <el-table :data="tableData">
      <el-table-column
        label="用户ID"
        prop="userId"
        width="80"
      ></el-table-column>
      <el-table-column label="会话ID">
        <template #default="{ row }">
          <el-avatar>{{ row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="记录日期"
        prop="diaryDate"
        width="120"
      ></el-table-column>
      <el-table-column label="情绪评分" width="200">
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
      <el-table-column
        label="情绪评分范围"
        prop="moodScoreRange"
        width="200"
      ></el-table-column>
      <el-table-column label="创建时间" prop="createdAt"></el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import TableSearch from "@/components/TableSearch.vue";
import { getEmotionalList } from "@/api/admin";

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

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await getEmotionalList(params);
  tableData.value = records;
  pagination.total = total;
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
}
</style>
