<script setup lang="ts">
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData";
import { BookingEntity } from "../../../../../../server/api/entities/bookings/bookings.types";
import BookingsForm from "../BookingsForm.vue";
import { ClientEntity } from "../../../../../../server/api/entities/clients/clients.types.ts";

interface Data {
  booking: BookingEntity;
  client: ClientEntity;
}

const data: Ref<Data> = useData();
</script>
<template>
  <BookingsForm :isEdit="true" :initialBooking="data.booking" />
</template>
