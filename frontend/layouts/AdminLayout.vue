<script setup lang="ts">
import AdminHeader from "../components/admin/AdminHeader.vue";
import AdminSidebar from "../components/admin/AdminSidebar.vue";
import CoverLoader from "../components/CoverLoader.vue";
import { useLoaderStore } from "../stores/useLoaderStore.ts";
import { storeToRefs } from "pinia";
const { showLoader } = storeToRefs(useLoaderStore());
</script>
<template>
  <div id="admin-layout" class="h-screen flex">
    <AdminSidebar />
    <div class="w-full overflow-auto relative">
      <AdminHeader />
      <slot />
      <CoverLoader v-if="showLoader" />
    </div>
  </div>
</template>

<style>
@import "../assets/styles/admin.scss";
</style>
