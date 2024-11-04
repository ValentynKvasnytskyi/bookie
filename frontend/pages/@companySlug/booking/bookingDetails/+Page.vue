<script setup lang="ts">
import { ref, Ref, computed, unref } from "vue";
import { usePageContext } from "../../../../../renderer/usePageContext";
import LangSwitcher from "../../../../components/LangSwitcher.vue";
import Card from "../../../../components/Card.vue";
import { useTranslations } from "../../../../localization/useTranslations";
import { ScheduleDay } from "../../../../../server/api/entities/schedules/schedules.types";
import moment from "moment";
import { useData } from "../../../../../renderer/useData";
import { ApiService } from "../../../../services/ApiService";
import { ClientEntity } from "../../../../../server/api/entities/clients/clients.types";
import { CategoryEntity } from "../../../../../server/api/entities/categories/categories.types";
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types";
import {
  CCol,
  CRow,
  CCardTitle,
  CFormInput,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormTextarea,
} from "@coreui/vue";
import { BookingEntity } from "../../../../../server/api/entities/bookings/bookings.types";
import { navigate } from "vike/client/router";
import { useUrlHelper } from "../../../../composables/useUrlHelper";

// TODO: moment js localization

interface Data {
  category: CategoryEntity;
  service: ServiceEntity;
  provider: ProviderEntity;
  scheduleDays: ScheduleDay[];
  busySlots: BusySlot[];
  serviceDuration: number | null;
}

interface BusySlot {
  startDate: string;
  endDate: string;
}

// api service
const apiService = new ApiService<BookingEntity>("bookings");

// pageContext
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// helpers
const { getLocalizedUrl } = useUrlHelper();

// refs
const data: Ref<Data> = useData();
const today = moment.utc().startOf("day");
const selectedMonth: Ref<moment.Moment> = ref(moment.utc());
const selectedDate: Ref<moment.Moment | null> = ref(null);
const selectedTime: Ref<moment.Moment | null> = ref(null);
const showConfirmationModal = ref(false);
const client: Ref<ClientEntity> = ref({
  name: "",
  email: "",
  phoneNumber: "",
  companySlug: pageContext.value.routeParams.companySlug,
  isBlocked: false,
});
const clientComment = ref("");
// computed
const acceptButtonDisabled = computed(
  () => !client.value.name || !client.value.email || !client.value.phoneNumber || !selectDate || !selectedTime.value,
);
const selectedDayBusySlots = computed(() => {
  return data.value.busySlots.filter((slot) => moment.utc(slot.startDate).isSame(selectedDate.value, "day"));
});
const timeSlots = computed(() => {
  if (!selectedDate.value) return [];

  const daySchedule = getDaySchedule(selectedDate.value);
  if (!daySchedule || daySchedule.isDayOff) return [];

  const slots: moment.Moment[] = [];
  const date = moment.utc(selectedDate.value);

  const startTime = date
    .clone()
    .hours(daySchedule.startHour as number)
    .minutes(daySchedule.startMinute as number);
  const endTime = date
    .clone()
    .hours(daySchedule.endHour as number)
    .minutes(daySchedule.endMinute as number)
    .subtract((data.value.serviceDuration as number) - 15, "minutes");
  const currentTime = startTime.clone();

  while (currentTime.isBefore(endTime)) {
    if (isSlotAvailable(currentTime)) {
      slots.push(currentTime.clone());
    }
    currentTime.add(15, "minutes");
  }

  return slots;
});

const days = computed(() => {
  const result: moment.Moment[] = [];

  const startOfMonth = moment.utc(selectedMonth.value).startOf("month");

  const endOfMonth = moment.utc(selectedMonth.value).endOf("month");

  const startOfWeek = startOfMonth.clone().startOf("isoWeek");

  const endOfWeek = endOfMonth.clone().endOf("isoWeek");

  for (let day = startOfWeek; day.isBefore(endOfWeek); day.add(1, "day")) {
    result.push(day.clone());
  }

  return result;
});

const canShowPrevMonth = computed(() => {
  const date = moment.utc(selectedMonth.value);
  return !date.subtract(1, "month").isBefore(today, "month");
});

// methods
function getDaySchedule(date: moment.Moment): ScheduleDay | undefined {
  if (!date) {
    return undefined;
  }

  const dayIndex = date.day();
  const scheduleIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return data.value.scheduleDays.find((day) => day.index === scheduleIndex);
}

function isDateAvailable(date: moment.Moment): boolean {
  if (isPastDate(date)) return false;

  const daySchedule = getDaySchedule(date);
  return daySchedule ? !daySchedule.isDayOff : false;
}

function isPastDate(date: moment.Moment): boolean {
  return date.isBefore(today, "day");
}

function formatDate(date: moment.Moment, format: string): string {
  switch (format) {
    case "MMMM yyyy":
      return date.format("MMMM YYYY");
    case "EEE":
      return date.format("dd");
    case "d MMMM":
      return date.format("D MMMM");
    case "HH:mm":
      return date.format("HH:mm");
    case "d MMMM в HH:mm":
      return date.format("D MMMM в HH:mm");
    default:
      return date.format("L");
  }
}

function nextMonth() {
  selectedDate.value = null;
  selectedMonth.value = moment(selectedMonth.value).add(1, "month");
}

function prevMonth() {
  selectedDate.value = null;
  const prevMonthDate = moment(selectedMonth.value).subtract(1, "month");
  if (!prevMonthDate.isBefore(today, "month")) {
    selectedMonth.value = prevMonthDate;
  }
}

function selectDate(date: moment.Moment) {
  if (isDateAvailable(date)) {
    selectedDate.value = moment.utc(date);
    selectedTime.value = null;
  }
}

function selectTime(time: moment.Moment) {
  selectedTime.value = moment.utc(time);
}

const isSameDay = (date1: moment.Moment | null, date2: moment.Moment): boolean => {
  return date1 !== null && date1.isSame(date2, "day");
};

function isSlotAvailable(slotTime: moment.Moment): boolean {
  if (slotTime.isBefore(moment.utc())) return false;

  const slotEnd = slotTime.clone().add(data.value.serviceDuration, "minutes");
  const daySchedule = getDaySchedule(slotTime);
  if (!daySchedule) return false;

  const workDayEnd = slotTime
    .clone()
    .hours(daySchedule.endHour as number)
    .minutes(daySchedule.endMinute as number);

  if (slotEnd.isAfter(workDayEnd)) {
    return false;
  }

  if (daySchedule?.breakTime) {
    const breakStart = slotTime
      .clone()
      .hours(daySchedule.breakTime.startHour)
      .minutes(daySchedule.breakTime.startMinute);
    const breakEnd = slotTime.clone().hours(daySchedule.breakTime.endHour).minutes(daySchedule.breakTime.endMinute);

    if (slotTime.isBefore(breakEnd) && slotEnd.isAfter(breakStart)) {
      return false;
    }
  }

  const slotEndTime = moment.utc(slotTime).add(data.value.serviceDuration, "minutes");

  return !selectedDayBusySlots.value.some((bookedSlot) => {
    const bookedStart = moment(bookedSlot.startDate);
    const bookedEnd = moment(bookedSlot.endDate);

    return (
      (slotTime.isSameOrAfter(bookedStart) && slotTime.isBefore(bookedEnd)) ||
      (slotEndTime.isAfter(bookedStart) && slotEndTime.isSameOrBefore(bookedEnd)) ||
      (slotTime.isSameOrBefore(bookedStart) && slotEndTime.isSameOrAfter(bookedEnd))
    );
  });
}

async function saveBooking() {
  const { service, provider, serviceDuration } = data.value;
  const { companySlug } = pageContext.value.routeParams;
  const objectToSend: BookingEntity = {
    service: service._id as string,
    provider: provider._id as string,
    client: unref(client.value),
    startDate: selectedTime.value?.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") as string,
    endDate: selectedTime.value?.add(serviceDuration, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") as string,
    isDeclined: false,
    clientComment: unref(clientComment.value),
    companySlug,
  };

  const response = await apiService.create(objectToSend);
  if (!response) {
    return;
  }

  const navigateUrl = `/${companySlug}/booking/${response._id}/`;
  await navigate(getLocalizedUrl(navigateUrl, pageContext.value.locale));
}
</script>
<template>
  <Card class="w-75">
    <template #header>
      <CCardTitle class="text-xl">{{ t(`booking.details.title`) }}</CCardTitle>
      <LangSwitcher />
    </template>
    <template #body>
      <CRow class="pb-4">
        <CCol sm="5">
          <CFormInput v-model="client.name" class="mb-3" :label="t('form.label.name')" />
          <CFormInput v-model="client.email" class="mb-3" type="email" :label="t('form.label.email')" />
          <CFormInput v-model="client.phoneNumber" class="mb-3" :label="t('form.label.phoneNumber')" />
          <CFormTextarea v-model="clientComment" class="mb-3" :label="t('form.label.client_comment')" />
          <CButton
            color="primary"
            class="ms-auto d-block"
            @click="showConfirmationModal = true"
            :disabled="acceptButtonDisabled"
          >
            {{ t("button.accept") }}
          </CButton>
        </CCol>
        <CCol sm="7">
          <div class="flex items-center justify-between mb-6">
            <button
              @click="prevMonth"
              :disabled="!canShowPrevMonth"
              :class="[
                'p-2 rounded-full',
                canShowPrevMonth ? 'hover:bg-gray-100 text-gray-800' : 'text-gray-300 cursor-not-allowed',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <h2 class="text-xl font-semibold capitalize">
              {{ formatDate(selectedMonth, "MMMM yyyy") }}
            </h2>

            <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <template v-for="day in days" :key="day.valueOf()">
              <button
                @click="selectDate(day)"
                :disabled="!isDateAvailable(day)"
                :class="[
                  'flex flex-col items-center py-1 rounded-lg',
                  !isDateAvailable(day)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isSameDay(selectedDate, day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200',
                ]"
              >
                <div class="text-sm capitalize">{{ formatDate(day, "EEE") }}</div>
                <div class="font-semibold">{{ day.date() }}</div>
              </button>
            </template>
          </div>

          <template v-if="selectedDate && getDaySchedule(selectedDate)">
            <div class="mt-4">
              <h3 class="text-lg font-semibold mb-4" v-if="timeSlots.length">
                {{ t("booking.available_time") }} {{ formatDate(selectedDate, "d MMMM") }}:
              </h3>
              <h3 class="text-lg font-semibold" v-else>К сожалению все слоты заняты</h3>
              <div class="grid md:grid-cols-4 sm:grid-cols-3 gap-2">
                <button
                  v-for="time in timeSlots"
                  :key="time.valueOf()"
                  @click="selectTime(time)"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm',
                    selectedTime?.isSame(time) ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200',
                  ]"
                >
                  {{ formatDate(time, "HH:mm") }}
                </button>
              </div>

              <template v-if="getDaySchedule(selectedDate)?.breakTime && timeSlots.length">
                <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  {{ t("booking.break_time") }}: {{ getDaySchedule(selectedDate)?.breakTime?.startHour }}:{{
                    getDaySchedule(selectedDate)?.breakTime?.startMinute.toString().padStart(2, "0")
                  }}
                  - {{ getDaySchedule(selectedDate)?.breakTime?.endHour }}:{{
                    getDaySchedule(selectedDate)?.breakTime?.endMinute.toString().padStart(2, "0")
                  }}
                </div>
              </template>
            </div>
          </template>
        </CCol>
      </CRow>
    </template>
  </Card>
  <CModal :visible="showConfirmationModal">
    <CModalHeader> {{ t("booking.confirm.modal.title") }} </CModalHeader>
    <CModalBody>
      <CCardTitle class="text-xl mb-4">{{ t("booking.confirm.title") }}</CCardTitle>
      <div>
        {{ t("booking.modal.title.category") }}: <strong>{{ data.category.name }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.service") }}: <strong>{{ data.service.name }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.provider") }}: <strong>{{ data.provider.name }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.date") }}: <strong>{{ selectedDate?.format("DD.MM.YYYY") ?? "" }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.time") }}: <strong>{{ selectedTime?.format("HH:mm") ?? "" }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.client_name") }}: <strong>{{ client.name }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.client_email") }}: <strong>{{ client.email }}</strong>
      </div>
      <div>
        {{ t("booking.modal.title.client_phoneNumber") }}: <strong>{{ client.phoneNumber }}</strong>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="showConfirmationModal = false">{{ t("button.cancel") }}</CButton>
      <CButton color="success" class="text-white" @click="saveBooking">{{ t("button.book") }}</CButton>
    </CModalFooter>
  </CModal>
</template>
