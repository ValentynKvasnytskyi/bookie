<script setup lang="ts">
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData";
import { CategoryEntity } from "../../../../../../server/api/entities/categories/categories.types";
import CategoriesForm from "../CategoriesForm.vue";

interface Data {
  category: CategoryEntity;
}

const data: Ref<Data> = useData();
</script>
<template>
  <CategoriesForm :isEdit="true" :initialCategory="data.category" />
</template>
