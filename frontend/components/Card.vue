<script setup lang="ts">
withDefaults(defineProps<{ showHeader?: boolean }>(), {
  showHeader: true,
});
</script>
<template>
  <div class="max-w-full m-3 rounded shadow-lg bg-white text-sm">
    <div v-if="showHeader" class="px-4 py-2 flex justify-between items-center bg-gray-50 border-b">
      <slot name="header"></slot>
    </div>
    <div class="relative px-4 py-3">
      <slot name="body"></slot>
    </div>
  </div>
</template>
