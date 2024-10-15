<script setup lang="ts">
import { usePageContext } from "../../renderer/usePageContext.ts";
import { useTranslations } from "../localization/useTranslations.ts";
import { CSpinner } from "@coreui/vue";

defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
  opacity: {
    type: Number,
    default: 0.5,
  },
  absolute: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Loading",
  },
});
const pageContext = usePageContext();
const { t } = useTranslations(pageContext);
</script>

<template>
  <div class="cover-loader" :class="{ absolute }">
    <div class="cover-loader__overlay" :style="{ background: `rgba(255,255,255, ${opacity})` }"></div>
    <div class="cover-loader__content flex align-items-center">
      <h1 class="inline font-semibold text-3xl" v-if="showTitle">
        <slot name="loaderText">{{ t(title) }}...</slot>
      </h1>
      <CSpinner color="primary" />
    </div>
  </div>
</template>
