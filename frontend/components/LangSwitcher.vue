<script setup lang="ts">
import { env } from "../../config/env.ts";
import { useUrlHelper } from "../composables/useUrlHelper.ts";
import { usePageContext } from "../../renderer/usePageContext.ts";

const pageContext = usePageContext();
const { SUPPORTED_LOCALES } = env;
const { getLocalizedUrl } = useUrlHelper();
</script>
<template>
  <div class="flex items-center gap-2 align-middle">
    <a
      v-for="lang in SUPPORTED_LOCALES"
      :key="lang"
      :href="getLocalizedUrl(pageContext.urlLogical, lang)"
      class="text-indigo-600 font-semibold opa"
      :class="{
        'pointer-events-none': lang === pageContext.locale,
        'opacity-50': lang === pageContext.locale,
      }"
    >
      {{ lang.toUpperCase() }}
    </a>
  </div>
</template>
