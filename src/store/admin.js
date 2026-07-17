import { defineStore } from "pinia";
import { ref } from "vue";
export const useAdminStore = defineStore("admin", () => {
  const isCollapse = ref(true);

  const changeCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  return {
    isCollapse,
    changeCollapse,
  };
});
