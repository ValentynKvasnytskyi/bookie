<script setup lang="ts">
import { useUrlHelper } from "../composables/useUrlHelper.ts";

withDefaults(defineProps<{ locale: string; size?: string; color?: string }>(), {
  size: "xl",
  color: "gray-900",
});

const { getLocalizedIndexUrl } = useUrlHelper();
</script>
<template>
  <div class="relative flex flex-col md:flex-row">
    <a
      :href="getLocalizedIndexUrl(locale)"
      class="flex items-center font-medium lg:w-auto lg:items-center lg:justify-center"
    >
      <span class="mx-auto font-black leading-none select-none" :class="`text-${size} text-${color}`">
        BOOKIE
        <span class="text-indigo-600">.</span>
      </span>
    </a>
  </div>
</template>
