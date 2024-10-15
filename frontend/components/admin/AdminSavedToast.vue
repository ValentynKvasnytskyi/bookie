<script setup lang="ts">
import { CToaster, CToast, CToastHeader, CToastBody } from "@coreui/vue";
defineProps<{ entityName: string }>();
</script>
<template>
  <CToaster class="p-3" placement="top-end">
    <CToast :autohide="false" visible>
      <CToastHeader closeButton>
        <svg
          class="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#1b9e3e"></rect>
        </svg>
        <span class="me-auto fw-bold">Success</span>
      </CToastHeader>
      <CToastBody>Successfully saved {{ entityName }}</CToastBody>
    </CToast>
  </CToaster>
</template>
