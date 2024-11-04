<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useUrlHelper } from "../../../../composables/useUrlHelper";
import { useTranslations } from "../../../../localization/useTranslations";
import { navigate } from "vike/client/router";
import Card from "../../../../components/Card.vue";
import AdminSavedToast from "../../../../components/admin/AdminSavedToast.vue";
import { CButton, CFormCheck, CFormInput, CFormTextarea, CFormLabel } from "@coreui/vue";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types";
import { ApiService } from "../../../../services/ApiService";
import Multiselect from "vue-multiselect/src/Multiselect.vue";
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types";
import { ScheduleEntity } from "../../../../../server/api/entities/schedules/schedules.types";
import AdminSchedule from "../../../../components/admin/AdminSchedule.vue";

const props = defineProps<{
  initialProvider: ProviderEntity | null;
  services: ServiceEntity[];
  companySchedule: ScheduleEntity | null;
  isEdit: boolean;
}>();

// api service
const apiService = new ApiService<ProviderEntity>("providers");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const { companySlug } = pageContext.value.routeParams;
const isSaved = ref(false);
const provider: Ref<ProviderEntity> = ref(
  props.initialProvider || {
    _id: undefined,
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    isActive: true,
    services: [],
    schedule: props.companySchedule || null,
    companySlug,
  },
);
const selectedServices: Ref<{ name: string; id: string }[]> = ref(
  getServicesOptions((provider.value.services || []) as ServiceEntity[]),
);

// computed
const title = computed(() => (props.isEdit ? t("providers.title.edit") : t("providers.title.create")));
const servicesOptions = computed(() => getServicesOptions(props.services));

function getServicesOptions(services: ServiceEntity[]) {
  return services?.map((service) => ({ name: service.name, id: service._id as string })) || [];
}

async function save() {
  const body = { ...provider.value };

  if (!body._id) {
    delete body._id;
  }

  const response = props.isEdit && body._id ? await apiService.update(body._id, body) : await apiService.create(body);
  if (!response) {
    return;
  }

  isSaved.value = true;
  provider.value = response;

  setTimeout(async () => {
    isSaved.value = false;
    if (!props.isEdit) {
      const navigateUrl = `/${companySlug}/admin/providers/${provider.value._id}`;

      await navigate(getLocalizedUrl(navigateUrl, pageContext.value.locale));
    }
  }, 2000);
}
function selectService(selectedServices: { name: string; id: string }[]) {
  provider.value.services = selectedServices.map((servicesOption) => servicesOption.id);
}

async function updateProviderSchedule(schedule: ScheduleEntity) {
  provider.value.schedule = schedule;
}
</script>

<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ title }}</span>
    </template>
    <template #body>
      <CFormInput v-model="provider.name" :label="t('form.label.name')" class="mb-4" />
      <CFormTextarea v-model="provider.description" :label="t('form.label.description')" rows="3" class="mb-4" />
      <CFormInput v-model="provider.email" :label="t('form.label.email')" class="mb-4" />
      <CFormInput v-model="provider.phoneNumber" :label="t('form.label.phoneNumber')" class="mb-4" />
      <CFormCheck v-model="provider.isActive" :label="t('form.label.isActive')" id="isActiveProvider" class="mb-4" />
      <CFormLabel>{{ t("form.label.service") }}</CFormLabel>
      <Multiselect
        v-model="selectedServices"
        :options="servicesOptions"
        :multiple="true"
        :hide-selected="true"
        track-by="name"
        label="name"
        @update:modelValue="selectService"
        class="mb-5"
      />

      <AdminSchedule
        @update:schedule="updateProviderSchedule"
        :companySchedule="companySchedule"
        :entitySchedule="provider.schedule as ScheduleEntity"
      />

      <CButton color="success" class="text-white ml-auto d-block" @click="save">
        {{ t("button.save") }}
      </CButton>
    </template>
  </Card>
  <AdminSavedToast v-if="isSaved" :entityName="t('provider')" />
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
