<script setup lang="ts">
import { useData } from "../../../../../renderer/useData";
import { computed, Ref, ref } from "vue";
import Card from "../../../../components/Card.vue";
import Table from "../../../../components/Table.vue";
import { ClientEntity } from "../../../../../server/api/entities/clients/clients.types";
import { useUrlHelper } from "../../../../composables/useUrlHelper";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { CButton, CButtonGroup } from "@coreui/vue";
import { useTranslations } from "../../../../localization/useTranslations";
import { ApiService } from "../../../../services/ApiService";
import AdminYesNoBadge from "../../../../components/admin/AdminYesNoBadge.vue";
import { QueryParams } from "../../../../services/HttpClient";
import Pagination from "../../../../components/Pagination.vue";
import moment from "moment-timezone";

interface Data {
  clients: ClientEntity[];
  totalItemsCount: number;
}

// api service
const apiService = new ApiService<ClientEntity>("clients");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const data: Ref<Data> = useData();
const clients: Ref<ClientEntity[]> = ref(data.value.clients);

// computed
const columns = computed(() => [
  { field: "name", label: t("table.title.clientName") },
  { field: "email", label: t("table.title.email") },
  { field: "phoneNumber", label: t("table.title.phoneNumber") },
  { field: "isBlocked", label: t("table.title.isBlocked") },
  { field: "createdAt", label: t("table.title.createdAt") },
  { field: "actions", label: t("table.title.actions") },
]);

async function deleteItem(id: string) {
  const isDeleted = await apiService.delete(id);

  if (isDeleted) {
    await fetchData();
  }
}

async function fetchData(filters?: QueryParams) {
  const response = await apiService.getList(filters);

  clients.value = response.data;
}

async function changePage(page: number) {
  await fetchData({ page });
}
</script>
<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ t("clients.title") }}</span>
      <a
        :href="getLocalizedUrl(`/${pageContext.routeParams.companySlug}/admin/clients/create`, pageContext.locale)"
        class="bg-green-600 text-white px-3 py-1 rounded-2 hover:bg-green-700"
        >{{ t("button.create") }}</a
      >
    </template>
    <template #body>
      <Table :columns="columns" :items="clients" :totalItems="data.totalItemsCount">
        <template #isBlocked="{ item }">
          <AdminYesNoBadge :success="item.isBlocked" :isActiveLabel="false" />
        </template>
        <template #createdAt="{ item }">
          {{ moment.tz(item.createdAt, "Europe/Kyiv").format("DD.MM.YYYY HH:mm") }}
        </template>
        <template #actions="{ item }">
          <CButtonGroup vertical>
            <a
              :href="
                getLocalizedUrl(`/${pageContext.routeParams.companySlug}/admin/clients/${item._id}`, pageContext.locale)
              "
              class="btn btn-primary"
            >
              {{ t("button.edit") }}
            </a>
            <CButton class="text-white" color="danger" @click="deleteItem(item._id)">
              {{ t("button.delete") }}
            </CButton>
          </CButtonGroup>
        </template>
      </Table>
      <Pagination :totalItems="data.totalItemsCount" @changePage="changePage" />
    </template>
  </Card>
</template>
