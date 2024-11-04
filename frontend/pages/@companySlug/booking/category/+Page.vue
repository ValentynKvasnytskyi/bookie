<script setup lang="ts">
import { useData } from "../../../../../renderer/useData";
import { CategoryEntity } from "../../../../../server/api/entities/categories/categories.types";
import { Ref } from "vue";
import BookingEntitySelect from "../../../../components/booking/BookingEntitySelect.vue";

interface Data {
  categories: CategoryEntity[];
}

const data: Ref<Data> = useData();
</script>
<template>
  <BookingEntitySelect :entities="data.categories" entities-type="categories" />
</template>
