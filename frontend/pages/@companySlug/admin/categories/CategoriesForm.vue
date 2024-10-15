<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useUrlHelper } from "../../../../composables/useUrlHelper.ts";
import { useTranslations } from "../../../../localization/useTranslations";
import { navigate } from "vike/client/router";
import Card from "../../../../components/Card.vue";
import AdminSavedToast from "../../../../components/admin/AdminSavedToast.vue";
import { CButton, CFormCheck, CFormInput } from "@coreui/vue";
import { CategoryEntity } from "../../../../../server/api/entities/categories/categories.types";
import { ApiService } from "../../../../services/ApiService";

const props = defineProps<{
  initialCategory?: CategoryEntity;
  isEdit: boolean;
}>();

// api service
const apiService = new ApiService<CategoryEntity>("categories");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const { companySlug } = pageContext.value.routeParams;
const isSaved = ref(false);
const category: Ref<CategoryEntity> = ref(
  props.initialCategory || {
    _id: undefined,
    name: "",
    description: "",
    isActive: true,
    companySlug,
  },
);

// computed
const title = computed(() => (props.isEdit ? t("categories.title.edit") : t("categories.title.create")));

async function save() {
  const body = { ...category.value };

  if (!body._id) {
    delete body._id;
  }

  const response = props.isEdit && body._id ? await apiService.update(body._id, body) : await apiService.create(body);
  if (!response) {
    return;
  }

  isSaved.value = true;
  category.value = response;

  setTimeout(async () => {
    isSaved.value = false;
    if (!props.isEdit) {
      const navigateUrl = `/${companySlug}/admin/categories/${category.value._id}`;

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
      <CFormInput v-model="category.name" :label="t('form.label.name')" class="mb-4" />
      <CFormInput v-model="category.description" :label="t('form.label.description')" class="mb-4" />
      <CFormCheck v-model="category.isActive" :label="t('form.label.isActive')" id="isActive" />
      <CButton color="success" class="text-white ml-auto d-block" @click="save">
        {{ t("button.save") }}
      </CButton>
    </template>
  </Card>
  <AdminSavedToast v-if="isSaved" :entityName="t('category')" />
</template>
