<script setup lang="ts">
import { ref, Ref, computed, capitalize } from "vue";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types";
import { ApiService } from "../../../../services/ApiService";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useTranslations } from "../../../../localization/useTranslations";
import { useUrlHelper } from "../../../../composables/useUrlHelper";
import { useData } from "../../../../../renderer/useData";
import { QueryParams } from "../../../../services/HttpClient";
import Card from "../../../../components/Card.vue";
import Table from "../../../../components/Table.vue";
import AdminYesNoBadge from "../../../../components/admin/AdminYesNoBadge.vue";
import { CButton, CButtonGroup } from "@coreui/vue";
import Pagination from "../../../../components/Pagination.vue";

interface Data {
  providers: ProviderEntity[];
  totalItemsCount: number;
}

// api service
const apiService = new ApiService<ProviderEntity>("providers");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const data: Ref<Data> = useData();
const providers: Ref<ProviderEntity[]> = ref(data.value.providers);

// computed
const columns = computed(() => [
  { field: "name", label: t("table.title.providerName") },
  { field: "phoneNumber", label: t("table.title.phoneNumber") },
  { field: "email", label: t("table.title.email") },
  { field: "isActive", label: t("table.title.isActive") },
  { field: "services", label: t("table.title.services") },
  { field: "schedule", label: t("table.title.schedule") },
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

  providers.value = response.data;
}

async function changePage(page: number) {
  await fetchData({ page });
}
</script>
<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ t("providers.title") }}</span>
      <a
        :href="getLocalizedUrl(`/${pageContext.routeParams.companySlug}/admin/providers/create`, pageContext.locale)"
        class="bg-green-600 text-white px-3 py-1 rounded-2 hover:bg-green-700"
        >{{ t("button.create") }}</a
      >
    </template>
    <template #body>
      <Table :columns="columns" :items="providers" :totalItems="data.totalItemsCount">
        <template #services="{ item }">
          <div class="flex flex-col" v-for="(service, idx) in item.services" :key="service._id">
            <span class="mb-2 pb-2" :class="{ 'border-bottom-1': idx !== item.services.length - 1 }">
              {{ service.name }}
            </span>
          </div>
        </template>
        <template #schedule="{ item }">
          <div class="flex flex-col" v-for="day in item.schedule.days" :key="day._id">
            <span class="mb-2 pb-2" v-if="!day.isDayOff">
              {{ t(capitalize(day.dayName)) }}<br />
              {{ day.startHour }}:{{ day.startMinute === 0 ? "00" : day.startMinute.toString().padStart(2, "0") }} -
              {{ day.endHour }}:{{ day.endMinute === 0 ? "00" : day.endMinute.toString().padStart(2, "0") }} <br />
            </span>
          </div>
        </template>
        <template #isActive="{ item }">
          <AdminYesNoBadge :success="item.isActive" />
        </template>
        <template #actions="{ item }">
          <CButtonGroup vertical>
            <a
              :href="
                getLocalizedUrl(
                  `/${pageContext.routeParams.companySlug}/admin/providers/${item._id}`,
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
