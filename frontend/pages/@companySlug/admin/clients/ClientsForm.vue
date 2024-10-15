<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useUrlHelper } from "../../../../composables/useUrlHelper";
import { useTranslations } from "../../../../localization/useTranslations";
import { navigate } from "vike/client/router";
import Card from "../../../../components/Card.vue";
import AdminSavedToast from "../../../../components/admin/AdminSavedToast.vue";
import { CButton, CFormCheck, CFormInput } from "@coreui/vue";
import { ClientEntity } from "../../../../../server/api/entities/clients/clients.types";
import { ApiService } from "../../../../services/ApiService";
import moment from "moment-timezone";

const props = defineProps<{
  initialClient?: ClientEntity;
  isEdit: boolean;
}>();

// api service
const apiService = new ApiService<ClientEntity>("clients");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const { companySlug } = pageContext.value.routeParams;
const isSaved = ref(false);
const client: Ref<ClientEntity> = ref(
  props.initialClient || {
    _id: undefined,
    name: "",
    email: "",
    phoneNumber: "",
    isBlocked: false,
    createdAt: "",
    updatedAt: "",
    companySlug,
  },
);

// computed
const title = computed(() => (props.isEdit ? t("clients.title.edit") : t("clients.title.create")));

async function save() {
  const body = { ...client.value };

  if (!body._id) {
    delete body._id;
  }

  const response = props.isEdit && body._id ? await apiService.update(body._id, body) : await apiService.create(body);
  if (!response) {
    return;
  }

  isSaved.value = true;
  client.value = response;

  setTimeout(async () => {
    isSaved.value = false;
    if (!props.isEdit) {
      const navigateUrl = `/${companySlug}/admin/clients/${client.value._id}`;

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
      <CFormInput v-model="client.name" :label="t('form.label.name')" class="mb-4" />
      <CFormInput v-model="client.email" :label="t('form.label.email')" class="mb-4" />
      <CFormInput v-model="client.phoneNumber" :label="t('form.label.phoneNumber')" class="mb-4" />
      <CFormCheck id="clientIsBlocked" v-model="client.isBlocked" :label="t('form.label.isBlocked')" class="mb-4" />
      <CFormInput
        :value="moment.tz(client.createdAt, 'Europe/Kyiv').format('DD.MM.YYYY HH:mm')"
        :label="t('form.label.createdAt')"
        class="mb-4"
        v-if="client.createdAt"
        disabled
      />
      <CFormInput
        :value="moment.tz(client.updatedAt, 'Europe/Kyiv').format('DD.MM.YYYY HH:mm')"
        :label="t('form.label.updatedAt')"
        class="mb-4"
        v-if="client.updatedAt"
        disabled
      />
      <CButton color="success" class="text-white ml-auto d-block" @click="save">
        {{ t("button.save") }}
      </CButton>
    </template>
  </Card>
  <AdminSavedToast v-if="isSaved" :entityName="t('client')" />
</template>
