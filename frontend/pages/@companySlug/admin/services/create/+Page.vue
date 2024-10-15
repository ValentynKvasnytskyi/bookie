<script setup lang="ts">
import ServicesForm from "../ServicesForm.vue";
import { CategoryEntity } from "../../../../../../server/api/entities/categories/categories.types.ts";
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData.ts";
interface Data {
  categories: CategoryEntity[];
}

const data: Ref<Data> = useData();
</script>
<template>
  <ServicesForm :isEdit="false" :categories="data.categories" />
</template>
