<script setup lang="ts">
import { Ref } from "vue";
import { useData } from "../../../../../../renderer/useData";
import ClientsForm from "../ClientsForm.vue";
import { ClientEntity } from "../../../../../../server/api/entities/clients/clients.types";

interface Data {
  client: ClientEntity;
}

const data: Ref<Data> = useData();
</script>
<template>
  <ClientsForm :isEdit="true" :initialClient="data.client" />
</template>
