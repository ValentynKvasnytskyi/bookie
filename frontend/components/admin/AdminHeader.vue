<script setup lang="ts">
import { useSidebarStore } from "../../stores/useSidebarStore.ts";
import LangSwitcher from "../LangSwitcher.vue";
import { CButton } from "@coreui/vue";
import { navigate } from "vike/client/router";
import { useUrlHelper } from "../../composables/useUrlHelper.ts";
import { usePageContext } from "../../../renderer/usePageContext.ts";

const { toggleSidebar } = useSidebarStore();
const { getLocalizedIndexUrl } = useUrlHelper();
const pageContext = usePageContext();
async function logout() {
  await fetch("/auth/logout", {
    method: "POST",
  })
    .then(async () => {
      await navigate(getLocalizedIndexUrl(pageContext.value.locale));
    })
    .catch((e) => {
      console.log(e);
    });
}
</script>
<template>
  <header class="flex w-full bg-white shadow-sm">
    <button
      id="burgerButton"
      class="flex flex-col items-center justify-center w-10 h-10 space-y-1 focus:outline-none me-auto"
      @click="toggleSidebar"
    >
      <span class="block w-5 h-0.5 bg-slate-700 transition-transform duration-300 rounded"></span>
      <span class="block w-5 h-0.5 bg-slate-700 transition-opacity duration-300 rounded"></span>
      <span class="block w-5 h-0.5 bg-slate-700 transition-transform duration-300 rounded"></span>
    </button>
    <LangSwitcher class="px-4" />
    <CButton @click="logout">Logout</CButton>
  </header>
</template>
