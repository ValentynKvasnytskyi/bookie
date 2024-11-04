<script setup lang="ts">
import { useData } from "../../../../../renderer/useData";
import { Ref } from "vue";
import BookingEntitySelect from "../../../../components/booking/BookingEntitySelect.vue";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types.ts";

interface Data {
  providers: ProviderEntity[];
}

const data: Ref<Data> = useData();
</script>
<template>
  <BookingEntitySelect :entities="data.providers" entities-type="providers" />
</template>
