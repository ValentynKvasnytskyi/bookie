import { ref } from "vue";
import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", () => {
  const showLoader = ref(false);

  return {
    showLoader,
  };
});
