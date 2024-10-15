<script setup lang="ts">
import { usePageContext } from "../../../renderer/usePageContext";
import { useTranslations } from "../../localization/useTranslations";
import { useUrlHelper } from "../../composables/useUrlHelper.ts";
import { NavigationLink } from "./AdminSidebar.vue";

defineProps<NavigationLink>();

const pageContext = usePageContext();
const { t } = useTranslations(pageContext);
const { getLocalizedUrl } = useUrlHelper();
</script>
<template>
  <a
    :href="getLocalizedUrl(href, pageContext.locale)"
    class="p-2 text-neutral-300 font-semibold hover:text-neutral-50 transition-colors"
  >
    {{ t(title) }}
  </a>
</template>
