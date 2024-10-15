<script setup lang="ts">
import { useData } from "../../../../../renderer/useData";
import { computed, Ref, ref } from "vue";
import Card from "../../../../components/Card.vue";
import Table from "../../../../components/Table.vue";
import { Service } from "../../../../../server/api/entities/services/services.types";
import { useUrlHelper } from "../../../../composables/useUrlHelper.ts";
import { usePageContext } from "../../../../../renderer/usePageContext.ts";
import { CButton, CButtonGroup } from "@coreui/vue";
import { useTranslations } from "../../../../localization/useTranslations.ts";
import { ApiService } from "../../../../services/ApiService.ts";
import AdminYesNoBadge from "../../../../components/admin/AdminYesNoBadge.vue";
import { QueryParams } from "../../../../services/HttpClient.ts";
import Pagination from "../../../../components/Pagination.vue";

interface Data {
  services: Service[];
  totalItemsCount: number;
}

// api service
const apiService = new ApiService<Service>("services");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const data: Ref<Data> = useData();
const services: Ref<Service[]> = ref(data.value.services);

// computed
const columns = computed(() => [
  { field: "name", label: t("table.title.name") },
  { field: "description", label: t("table.title.description") },
  { field: "price", label: t("table.title.price") },
  { field: "duration", label: t("table.title.duration") },
  { field: "isActive", label: t("table.title.status") },
  { field: "category", label: t("table.title.category") },
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

  services.value = response.data;
}

async function changePage(page: number) {
  await fetchData({ page });
}
</script>
<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ t("services.title") }}</span>
      <a
        :href="getLocalizedUrl(`/${pageContext.routeParams.companySlug}/admin/services/create`, pageContext.locale)"
        class="bg-green-600 text-white px-3 py-1 rounded-2 hover:bg-green-700"
        >{{ t("button.create") }}
      </a>
    </template>
    <template #body>
      <Table :columns="columns" :items="services" :totalItems="data.totalItemsCount">
        <template #category="{ item }">
          {{ item?.category?.name || "" }}
        </template>
        <template #isActive="{ item }">
          <AdminYesNoBadge :success="item.isActive" />
        </template>
        <template #actions="{ item }">
          <CButtonGroup vertical>
            <a
              :href="
                getLocalizedUrl(
                  `/${pageContext.routeParams.companySlug}/admin/services/${item._id}`,
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
