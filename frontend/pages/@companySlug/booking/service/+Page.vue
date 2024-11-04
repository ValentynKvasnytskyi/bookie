<script setup lang="ts">
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types";
import { Ref } from "vue";
import { useData } from "../../../../../renderer/useData";
import CategoriesServicesSelect from "../../../../components/booking/BookingEntitySelect.vue";

interface Data {
  services: ServiceEntity[];
}

const data: Ref<Data> = useData();
</script>
<template>
  <CategoriesServicesSelect :entities="data.services" entities-type="services" />
</template>
