<script setup lang="ts">
import { usePageContext } from "../../../../../renderer/usePageContext.ts";
import { useTranslations } from "../../../../localization/useTranslations.ts";

const pageContext = usePageContext();
const { t } = useTranslations(pageContext);
</script>
<template>
  <h1 class="text-slate-700 font-bold text-3xl w-full pt-10 text-center">
    {{ t("Admin panel title") }}
  </h1>
</template>
