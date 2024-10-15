<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { usePageContext } from "../../../../../renderer/usePageContext";
import { useUrlHelper } from "../../../../composables/useUrlHelper";
import { useTranslations } from "../../../../localization/useTranslations";
import { navigate } from "vike/client/router";
import Card from "../../../../components/Card.vue";
import AdminSavedToast from "../../../../components/admin/AdminSavedToast.vue";
import { CButton, CFormCheck, CFormInput, CRow, CCol, CCardTitle } from "@coreui/vue";
import { ApiService } from "../../../../services/ApiService";
import { BookingEntity } from "../../../../../server/api/entities/bookings/bookings.types";
import { ClientEntity } from "../../../../../server/api/entities/clients/clients.types.ts";
import moment from "moment-timezone";
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types.ts";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types.ts";

const props = defineProps<{
  initialBooking?: BookingEntity;
  isEdit: boolean;
}>();

// api service
const apiService = new ApiService<BookingEntity>("bookings");

// page context
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// composables
const { getLocalizedUrl } = useUrlHelper();

// refs
const { companySlug } = pageContext.value.routeParams;
const isSaved = ref(false);
const booking: Ref<BookingEntity> = ref(
  props.initialBooking || {
    _id: undefined,
    provider: null,
    services: [],
    client: null,
    startDate: "",
    endDate: "",
    clientComment: "",
    isDeclined: false,
    companySlug,
  },
);

// computed
const bookingDuration = computed(() =>
  booking.value.services.reduce((sum, item) => sum + (item as ServiceEntity)?.duration || 0, 0),
);
async function save() {
  const body = { ...booking.value };

  if (!body._id) {
    delete body._id;
  }

  const response = props.isEdit && body._id ? await apiService.update(body._id, body) : await apiService.create(body);
  if (!response) {
    return;
  }

  isSaved.value = true;
  booking.value = response;

  setTimeout(async () => {
    isSaved.value = false;
    if (!props.isEdit) {
      const navigateUrl = `/${companySlug}/admin/bookings/${booking.value._id}`;

      await navigate(getLocalizedUrl(navigateUrl, pageContext.value.locale));
    }
  }, 2000);
}
</script>

<template>
  <Card>
    <template #header>
      <span class="font-medium">{{ t("bookings.title.edit") }}</span>
    </template>
    <template #body>
      <CRow>
        <CCol sm="12" class="font-medium text-xl mb-2">{{ t("bookings.title.client.info") }}</CCol>
        <CCol sm="4">
          <CFormInput
            :value="(booking.client as ClientEntity).name"
            :label="t('form.label.client.name')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="4">
          <CFormInput
            :value="(booking.client as ClientEntity).phoneNumber"
            :label="t('form.label.client.phoneNumber')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="4">
          <CFormInput
            :value="(booking.client as ClientEntity).email"
            :label="t('form.label.client.email')"
            class="mb-4"
            disabled
          />
        </CCol>
      </CRow>
      <div class="border-b my-4"></div>
      <CRow>
        <CCol sm="12" class="font-medium text-xl mb-2">{{ t("bookings.title.booking.info") }}</CCol>
        <CCol sm="4">
          <CFormInput
            :value="moment.tz(booking.startDate, 'Europe/Kyiv').format('DD.MM.YYYY HH:mm')"
            :label="t('form.label.startDate')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="4">
          <CFormInput
            :value="moment.tz(booking.endDate, 'Europe/Kyiv').format('DD.MM.YYYY HH:mm')"
            :label="t('form.label.endDate')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="4">
          <CFormInput :value="bookingDuration" :label="t('form.label.duration')" class="mb-4" disabled />
        </CCol>
      </CRow>
      <div class="border-b my-4"></div>
      <CRow>
        <CCol sm="12" class="font-medium text-xl mb-2">{{ t("bookings.title.provider.info") }}</CCol>
        <CCol sm="4">
          <CFormInput
            :value="(booking.provider as ProviderEntity).name"
            :label="t('form.label.provider.name')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="4">
          <CFormInput
            :value="(booking.provider as ProviderEntity).phoneNumber"
            :label="t('form.label.provider.phoneNumber')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="4">
          <CFormInput
            :value="(booking.provider as ProviderEntity).email"
            :label="t('form.label.provider.email')"
            class="mb-4"
            disabled
          />
        </CCol>
        <CCol sm="12">
          <CFormCheck
            v-model="booking.isDeclined"
            :label="t('form.label.isDeclined')"
            id="isBookingDeclined"
            :custom="true"
          />
        </CCol>
      </CRow>
      <CButton color="success" class="text-white ml-auto d-block" @click="save">
        {{ t("button.save") }}
      </CButton>
    </template>
  </Card>
  <AdminSavedToast v-if="isSaved" :entityName="t('category')" />
</template>
