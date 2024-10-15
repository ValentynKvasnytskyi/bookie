<script setup lang="ts">
import { ref, Ref } from "vue";
import { storeToRefs } from "pinia";
import { usePageContext } from "../../../renderer/usePageContext.ts";
import { useSidebarStore } from "../../stores/useSidebarStore.ts";
import Logo from "../Logo.vue";
import AdminSidebarLink from "./AdminSidebarLink.vue";

export interface NavigationLink {
  href: string;
  title: string;
}

const pageContext = usePageContext();
const sidebarStore = useSidebarStore();
const { showSidebar } = storeToRefs(sidebarStore);
const navigation: Ref<NavigationLink[]> = ref([
  { href: "/kvsn/admin/categories", title: "sidebar.categories" },
  { href: "/kvsn/admin/services", title: "sidebar.services" },
  { href: "/kvsn/admin/bookings", title: "sidebar.bookings" },
  { href: "/kvsn/admin/clients", title: "sidebar.clients" },
  { href: "/kvsn/admin/providers", title: "sidebar.providers" },
  { href: "/kvsn/admin/company", title: "sidebar.company" },
]);
</script>
<template>
  <aside
    class="w-72 text-white bg-slate-700 overflow-hidden whitespace-nowrap"
    :class="{
      'max-w-0': !showSidebar,
      'max-w-72': showSidebar,
    }"
    style="transition: 0.3s ease"
  >
    <div class="flex justify-center p-4 border-slate-400 border-b-2">
      <Logo :locale="pageContext.locale" size="2xl" color="white" />
    </div>
    <div class="flex flex-col p-4">
      <AdminSidebarLink v-for="link in navigation" :key="link.href" :href="link.href" :title="link.title" />
    </div>
  </aside>
</template>
