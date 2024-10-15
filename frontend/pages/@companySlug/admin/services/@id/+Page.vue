<script setup lang="ts">
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData";
import { ServiceEntity } from "../../../../../../server/api/entities/services/services.types.ts";
import ServicesForm from "../ServicesForm.vue";
import { CategoryEntity } from "../../../../../../server/api/entities/categories/categories.types.ts";

interface Data {
  service: ServiceEntity;
  categories: CategoryEntity[];
}

const data: Ref<Data> = useData();
</script>
<template>
  <ServicesForm :isEdit="true" :initialService="data.service" :categories="data.categories" />
</template>
