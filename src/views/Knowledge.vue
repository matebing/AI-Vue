<template>
  <div>
    <PageHeader title="知识文档">
      <template #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHeader>
    <TableSearch :formItem="formItem" @search="handleSearch" />
  </div>
</template>
<script setup>
import PageHeader from "@/components/PageHeader.vue";
import TableSearch from "@/components/TableSearch.vue";
import { onMounted } from "vue";

const formItem = [
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请输入文章内容",
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

const handleSearch = (data) => {
  console.log("数据", data);
};

onMounted(() => {});
</script>
