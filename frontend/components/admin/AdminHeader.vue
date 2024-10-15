<script setup lang="ts">
import { usePageContext } from "../../../renderer/usePageContext.ts";
import { env } from "../../../config/env.ts";
import { useUrlHelper } from "../../composables/useUrlHelper.ts";
import { useSidebarStore } from "../../stores/useSidebarStore.ts";

const pageContext = usePageContext();
const { SUPPORTED_LOCALES } = env;
const { getLocalizedUrl } = useUrlHelper();
const { toggleSidebar } = useSidebarStore();
</script>
<template>
  <header class="flex justify-between w-full bg-white shadow-sm">
    <button
      id="burgerButton"
      class="flex flex-col items-center justify-center w-10 h-10 space-y-1 focus:outline-none"
      @click="toggleSidebar"
    >
      <span class="block w-5 h-0.5 bg-slate-700 transition-transform duration-300 rounded"></span>
      <span class="block w-5 h-0.5 bg-slate-700 transition-opacity duration-300 rounded"></span>
      <span class="block w-5 h-0.5 bg-slate-700 transition-transform duration-300 rounded"></span>
    </button>
    <div class="flex items-center gap-2 px-4 align-middle">
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
  </header>
</template>
