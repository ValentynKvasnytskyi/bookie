<script setup lang="ts">
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData";
import ProvidersForm from "../ProvidersForm.vue";
import { Data } from "../formData.types";

const data: Ref<Data> = useData();
</script>
<template>
  <ProvidersForm
    :isEdit="true"
    :initialProvider="data.provider"
    :services="data.services"
    :companySchedule="data.companySchedule"
  />
</template>
