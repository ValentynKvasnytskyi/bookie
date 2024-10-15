<script setup lang="ts">
import { computed } from "vue";
import { useTranslations } from "../../localization/useTranslations.ts";
import { usePageContext } from "../../../renderer/usePageContext.ts";
import { CBadge } from "@coreui/vue";

// props
const props = withDefaults(defineProps<{ success: boolean; isActiveLabel?: boolean }>(), {
  isActiveLabel: true,
});

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

const yesTitle = computed(() => (props.isActiveLabel ? "badge.active" : "badge.yes"));
const noTitle = computed(() => (props.isActiveLabel ? "badge.inActive" : "badge.no"));

const title = computed(() => (props.success ? yesTitle.value : noTitle.value));

const color = computed(() => (props.success ? "success" : "danger"));
</script>
<template>
  <CBadge :color="color">{{ t(title) }}</CBadge>
</template>
