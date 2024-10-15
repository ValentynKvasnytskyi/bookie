<script setup lang="ts">
import ProvidersForm from "../ProvidersForm.vue";
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData.ts";
import { Data } from "../formData.types";

const data: Ref<Data> = useData();
</script>
<template>
  <ProvidersForm
    :isEdit="false"
    :services="data.services"
    :companySchedule="data.companySchedule"
    :initialProvider="null"
  />
</template>
