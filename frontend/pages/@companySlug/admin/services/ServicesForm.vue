<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useUrlHelper } from "../../../../composables/useUrlHelper.ts";
import { useTranslations } from "../../../../localization/useTranslations";
import { navigate } from "vike/client/router";
import Card from "../../../../components/Card.vue";
import AdminSavedToast from "../../../../components/admin/AdminSavedToast.vue";
import { CButton, CFormCheck, CFormInput, CRow, CCol } from "@coreui/vue";
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types";
import { ApiService } from "../../../../services/ApiService";
import { CategoryEntity } from "../../../../../server/api/entities/categories/categories.types.ts";

const props = defineProps<{
  initialService?: ServiceEntity;
  isEdit: boolean;
  categories: CategoryEntity[];
}>();

// api service
const apiService = new ApiService<ServiceEntity>("services");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const { companySlug } = pageContext.value.routeParams;
const isSaved = ref(false);
const service: Ref<ServiceEntity> = ref(
  props.initialService || {
    _id: undefined,
    name: "",
    description: "",
    price: 0,
    duration: 0,
    category: null,
    isActive: true,
    companySlug,
  },
);
const categoriesOptions = ref(getCategoriesOptions());

// computed
const title = computed(() => (props.isEdit ? t("services.title.edit") : t("services.title.create")));

function getCategoriesOptions() {
  return [
    t("services.categories_select.placeholder"),
    ...props.categories.map((category) => ({ label: category.name, value: category._id })),
  ];
}

async function save() {
  const body = { ...service.value };

  if (!body._id) {
    delete body._id;
  }

  const response = props.isEdit && body._id ? await apiService.update(body._id, body) : await apiService.create(body);
  if (!response) {
    return;
  }

  isSaved.value = true;
  service.value = response;

  setTimeout(async () => {
    isSaved.value = false;
    if (!props.isEdit) {
      const navigateUrl = `/${companySlug}/admin/services/${service.value._id}`;

      await navigate(getLocalizedUrl(navigateUrl, pageContext.value.locale));
    }
  }, 2000);
}
</script>

<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ title }}</span>
    </template>
    <template #body>
      <CFormInput v-model="service.name" :label="t('form.label.name')" class="mb-4" />
      <CFormInput v-model="service.description" :label="t('form.label.description')" class="mb-4" />
      <CRow class="mb-4">
        <CCol sm="6">
          <CFormInput v-model="service.price" :label="t('form.label.price')" type="number" />
        </CCol>
        <CCol sm="6">
          <CFormInput v-model="service.duration" :label="t('form.label.duration')" type="number" />
        </CCol>
      </CRow>
      <label class="form-label">{{ t("form.label.categories") }}</label>
      <select class="form-select" name="category" id="category" v-model="service.category">
        <option v-for="option in categoriesOptions" :value="option.value" :key="option.value">
          {{ option.label }}
        </option>
      </select>
      <CFormCheck v-model="service.isActive" :label="t('form.label.isActive')" id="isActive" />
      <CButton color="success" class="text-white ml-auto d-block" @click="save">
        {{ t("button.save") }}
      </CButton>
    </template>
  </Card>
  <AdminSavedToast v-if="isSaved" :entityName="t('service', pageContext.locale)" />
</template>
