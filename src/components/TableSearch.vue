<template>
  <el-form>
    <template v-for="(item, index) in formItem" :key="index">
      <el-form-item :label="item.label" :prop="item.prop">
        <component
          :is="isComp(item.comp)"
          :placeholder="item.placeholder"
        ></component>
      </el-form-item>
    </template>
  </el-form>
</template>
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

//组件类型枚举函数
const isComp = (comp) => {
  return {
    input: "el-input",
    select: "el-select",
  }[comp];
};
</script>
