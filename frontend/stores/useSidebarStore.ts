import { ref } from "vue";
import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", () => {
  const showSidebar = ref(true);

  const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
  };

  return {
    showSidebar,
    toggleSidebar,
  };
});
