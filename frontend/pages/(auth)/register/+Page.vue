<script setup lang="ts">
import { ref } from "vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
const email = ref("");
const password = ref("");
</script>
<template>
  <Card class="w-1/3 m-auto" role="register">
    <template #title>
      <div class="flex justify-between">
        <h1 class="text-2xl">Register new company</h1>
        <SplitButton
          label="RU"
          dropdownIcon="pi pi-angle-down"
          :model="[{ label: 'UK', key: 'uk' }]"
          severity="secondary"
          size="small"
          outlined
          :buttonProps="{ disabled: 'Default Action' }"
        />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 mt-2">
        <InputText v-model="email" fluid placeholder="Enter email" />

        <Password v-model="password" fluid :feedback="false" toggleMask placeholder="Enter password" />

        <div class="flex flex-col gap-2">
          <Button severity="info">Register</Button>
          <div class="text-xs text-center">
            Already has a company?
            <a href="/login" class="text-sky-500">Login</a>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
