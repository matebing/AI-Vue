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

const formItem = [
  {
    comp: "input",
    label: "文章标题",
    prop: "title",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    label: "文章类型",
    prop: "category",
    placeholder: "请选择文章类型",
    options: [
      {
        label: "技术文章",
        value: "technical",
      },
      {
        label: "业务文章",
        value: "business",
      },
    ],
  },
];

const handleSearch = (data) => {
  console.log(data);
};
</script>
