<script setup lang="ts">
import Card from "../../../../components/Card.vue";
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types";
import { ApiService } from "../../../../services/ApiService";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useTranslations } from "../../../../localization/useTranslations";
import { useUrlHelper } from "../../../../composables/useUrlHelper";
import { ref, Ref, computed } from "vue";
import { useData } from "../../../../../renderer/useData";
import { Booking, BookingEntity } from "../../../../../server/api/entities/bookings/bookings.types";
import Table from "../../../../components/Table.vue";
import moment from "moment-timezone";
import AdminYesNoBadge from "../../../../components/admin/AdminYesNoBadge.vue";
import { CButton, CButtonGroup } from "@coreui/vue";
import { QueryParams } from "../../../../services/HttpClient.ts";
import Pagination from "../../../../components/Pagination.vue";
interface Data {
  bookings: Booking[];
  totalItemsCount: number;
}

// api service
const apiService = new ApiService<Booking>("bookings");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const data: Ref<Data> = useData();
const bookings: Ref<Booking[]> = ref(data.value.bookings);

// computed
const columns = computed(() => [
  { field: "clientName", label: t("table.title.client.name") },
  { field: "clientPhone", label: t("table.title.client.phone") },
  { field: "services", label: t("table.title.services") },
  { field: "providerName", label: t("table.title.provider.name") },
  { field: "totalDuration", label: t("table.title.totalDuration") },
  { field: "startDate", label: t("table.title.startDate") },
  { field: "clientComment", label: t("table.title.clientComments") },
  { field: "isDeclined", label: t("table.title.isDeclined") },
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

  bookings.value = response.data;
}
async function changePage(page: number) {
  await fetchData({ page });
}
</script>
<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ t("bookings.title") }}</span>
    </template>
    <template #body>
      <Table :columns="columns" :items="bookings" :totalItems="data.totalItemsCount">
        <template #clientName="{ item }">
          {{ item.client.name }}
        </template>
        <template #clientPhone="{ item }">
          {{ item.client.phoneNumber }}
        </template>
        <template #services="{ item }">
          {{ item.service?.name || "" }}
        </template>
        <template #totalDuration="{ item }">
          {{ item.service?.duration || 0 }}
        </template>
        <template #providerName="{ item }">{{ item.provider.name }}</template>
        <template #startDate="{ item }">
          {{ moment.tz(item.startDate, "Europe/Kyiv").format("DD.MM.YYYY HH:mm") }}
        </template>
        <template #clientComment="{ item }">
          {{ item.clientComment }}
        </template>
        <template #isDeclined="{ item }">
          <AdminYesNoBadge :success="item.isDeclined" :isActiveLabel="false" />
        </template>
        <template #actions="{ item }">
          <CButtonGroup>
            <a
              :href="
                getLocalizedUrl(
                  `/${pageContext.routeParams.companySlug}/admin/bookings/${item._id}`,
                  pageContext.locale,
                )
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
