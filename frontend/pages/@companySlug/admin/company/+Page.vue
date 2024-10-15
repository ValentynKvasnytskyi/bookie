<script setup lang="ts">
import { Ref, ref } from "vue";
import { CompanyEntity } from "../../../../../server/api/entities/companies/companies.types";
import { useData } from "../../../../../renderer/useData";
import { ApiService } from "../../../../services/ApiService";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useTranslations } from "../../../../localization/useTranslations";
import Card from "../../../../components/Card.vue";
import { CButton, CFormInput } from "@coreui/vue";
import { ScheduleEntity } from "../../../../../server/api/entities/schedules/schedules.types.ts";
import AdminSchedule from "../../../../components/admin/AdminSchedule.vue";

interface Data {
  company: CompanyEntity | null;
}

// api service
const apiService = new ApiService<CompanyEntity>("companies");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

const data: Ref<Data> = useData();
const company: Ref<CompanyEntity | null> = ref(data.value.company);

async function save() {
  if (!company.value) {
    return;
  }
  const response = await apiService.update(company.value._id as string, company.value);

  if (!response) {
    return;
  }

  company.value = response;
}
</script>
<template>
  <Card v-if="company">
    <template #header>{{ t("company.title.edit") }}</template>
    <template #body>
      <CFormInput v-model="company.name" :label="t('form.label.name')" class="mb-4" />
      <CFormInput v-model="company.description" :label="t('form.label.description')" class="mb-4" />
      <CFormInput v-model="company.phoneNumber" :label="t('form.label.phoneNumber')" class="mb-4" />
      <CFormInput v-model="company.email" :label="t('form.label.email')" class="mb-5" />
      <AdminSchedule
        :companySchedule="company.schedule as ScheduleEntity"
        :entitySchedule="company.schedule as ScheduleEntity"
        :showCompanyCheckbox="false"
        :editCompanySchedule="true"
      />

      <CButton color="success" class="text-white ml-auto d-block" @click="save">
        {{ t("button.save") }}
      </CButton>
    </template>
  </Card>
</template>
