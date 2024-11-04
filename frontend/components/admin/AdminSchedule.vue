<script setup lang="ts">
import { ScheduleDay, ScheduleEntity, ScheduleBreakTime } from "../../../server/api/entities/schedules/schedules.types";
import { ref, computed, onMounted, Ref } from "vue";
import { ApiService } from "../../services/ApiService.ts";
import { useTranslations } from "../../localization/useTranslations";
import { usePageContext } from "../../../renderer/usePageContext";
import { CFormInput, CFormCheck, CFormLabel, CButton, CModal, CModalHeader, CModalBody } from "@coreui/vue";
import { capitalize } from "vue";
import AdminYesNoBadge from "./AdminYesNoBadge.vue";

interface Props {
  companySchedule: ScheduleEntity | null | undefined;
  entitySchedule: ScheduleEntity | null | undefined;
  showCompanyCheckbox?: boolean;
  editCompanySchedule?: boolean;
}

// apiService
const apiService = new ApiService<ScheduleEntity>("schedules");

// props
const props = withDefaults(defineProps<Props>(), {
  showCompanyCheckbox: true,
  editCompanySchedule: false,
});

// emits
const emit = defineEmits(["update:schedule"]);

// pageContext
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// refs
const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const useCompanySchedule = ref(false);
const initialUseCompanySchedule = ref(false);
const showScheduleModal = ref(false);
const schedule: Ref<ScheduleEntity | null> = ref(
  props.entitySchedule ? JSON.parse(JSON.stringify(props.entitySchedule)) : getNewSchedule(),
);
const initialSchedule = JSON.parse(JSON.stringify(schedule.value));

// computed
const showBreakTimeCols = computed(() =>
  schedule.value ? schedule.value.days.some((day) => day.breakTime && !day.isDayOff) : false,
);

// methods
/**
 * Formats time as a string
 * @param {number} hour - The hour value
 * @param {number} minute - The minute value
 * @returns {string} Formatted time string (HH:MM)
 */
const getTimeString = (hour: number, minute: number): string => {
  const h = hour?.toString().padStart(2, "0") || "00";
  const m = minute?.toString().padStart(2, "0") || "00";

  return `${h}:${m}`;
};

/**
 * Updates the schedule for a specific day
 * @param {number} index - The index of the day in the schedule
 * @param {boolean} isDayOff - Whether the day is marked as a day off
 */
const updateSchedule = (index: number, isDayOff: boolean) => {
  if (!schedule.value) {
    return;
  }

  if (!isDayOff) {
    schedule.value.days[index].startHour = 9;
    schedule.value.days[index].startMinute = 0;
    schedule.value.days[index].endHour = 18;
    schedule.value.days[index].endMinute = 0;
    return;
  }

  schedule.value.days[index].startHour = null;
  schedule.value.days[index].startMinute = null;
  schedule.value.days[index].endHour = null;
  schedule.value.days[index].endMinute = null;
  schedule.value.days[index].breakTime = null;
};

/**
 * Updates the time for a specific day in the schedule
 * @param {number} index - The index of the day in the schedule
 * @param {string} type - The type of time to update ('start' or 'end')
 * @param {Event} event - The input event
 */
const updateTime = (index: number, type: string, event: InputEvent) => {
  const target = event.target as HTMLInputElement;

  const [hours, minutes] = target.value.split(":").map(Number);
  const day = schedule.value?.days[index];
  if (!day) {
    return;
  }

  if (type === "start") {
    day.startHour = hours;
    day.startMinute = minutes;
  } else {
    day.endHour = hours;
    day.endMinute = minutes;
  }
};

/**
 * Updates the break time for a specific day in the schedule
 * @param {number} index - The index of the day in the schedule
 * @param {string} type - The type of break time to update ('start' or 'end')
 * @param {Event} event - The input event
 */
const updateBreakTime = (index: number, type: string, event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  const [hours, minutes] = target.value.split(":").map(Number);
  const day = schedule.value?.days[index];
  if (!day) {
    return;
  }

  if (type === "start" && day.breakTime) {
    day.breakTime.startHour = hours;
    day.breakTime.startMinute = minutes;
  } else if (day.breakTime) {
    day.breakTime.endHour = hours;
    day.breakTime.endMinute = minutes;
  }
};

/**
 * Adds or removes break time for a specific day
 * @param {ScheduleDay} day - The day to update
 * @param {boolean} shouldAdd - Whether to add or remove the break time
 */
const addBreakTime = (day: ScheduleDay, shouldAdd: boolean) => {
  let breakTime: ScheduleBreakTime | null = {
    startHour: 13,
    endHour: 14,
    startMinute: 0,
    endMinute: 0,
  };
  if (!shouldAdd) {
    breakTime = null;
  }

  day.breakTime = breakTime;
};

function getNewSchedule(): ScheduleEntity {
  return {
    days: weekDays.map((day, index) => ({
      startHour: 9,
      endHour: 18,
      startMinute: 0,
      endMinute: 0,
      dayName: day,
      isDayOff: false,
      index,
      breakTime: null,
    })),
  };
}

async function setCompanySchedule(event: InputEvent) {
  const target = event.target as HTMLInputElement;
  const providerSchedule = initialSchedule?._id === props.companySchedule?._id ? getNewSchedule() : initialSchedule;
  schedule.value = target.checked ? props.companySchedule : providerSchedule;
}

async function saveSchedule() {
  if (useCompanySchedule.value && !props.editCompanySchedule) {
    emit("update:schedule", schedule);
    showScheduleModal.value = false;
    return;
  }

  if (!schedule.value) {
    showScheduleModal.value = false;
    return;
  }

  const scheduleResponse = schedule.value?._id
    ? await apiService.update(schedule.value._id, schedule.value)
    : await apiService.create(schedule.value);

  if (!scheduleResponse?._id) {
    showScheduleModal.value = false;
    return;
  }

  schedule.value = scheduleResponse;

  emit("update:schedule", schedule.value);

  showScheduleModal.value = false;
}

// hooks
onMounted(async () => {
  if (schedule.value?._id === props.companySchedule?._id) {
    useCompanySchedule.value = true;
    initialUseCompanySchedule.value = true;
    schedule.value = props.companySchedule ? JSON.parse(JSON.stringify(props.companySchedule)) : getNewSchedule();
    await saveSchedule();
    emit("update:schedule", schedule.value);
  }
});
</script>
<template>
  <div>
    <CFormLabel>
      {{ t("form.label.schedule") }}
    </CFormLabel>
    <div class="overflow-x-auto">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="px-2 py-2">{{ t("Day") }}</th>
            <th class="px-2 py-2">{{ t("Is day off") }}</th>
            <th class="px-2 py-2">{{ t("Break") }}</th>
            <th class="px-2 py-2">{{ t("Start time") }}</th>
            <th class="px-2 py-2">{{ t("End time") }}</th>
            <th class="px-2 py-2" v-if="showBreakTimeCols">{{ t("Break start") }}</th>
            <th class="px-2 py-2" v-if="showBreakTimeCols">{{ t("Break end") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in schedule?.days" :key="day.dayName" class="border-b">
            <td class="px-2 py-2">{{ t(capitalize(day.dayName)) }}</td>
            <td class="px-2 py-2">
              <AdminYesNoBadge :success="day.isDayOff" :isActiveLabel="false" />
            </td>
            <td class="px-2 py-2">
              <AdminYesNoBadge :success="!!day.breakTime" :isActiveLabel="false" />
            </td>
            <td class="px-2 py-2" v-if="day.startHour !== null && day.startMinute !== null">
              <span>{{ getTimeString(day.startHour, day.startMinute) }}</span>
            </td>
            <td class="px-2 py-2" v-if="day.endHour !== null && day.endMinute !== null">
              <span>{{ getTimeString(day.endHour, day.endMinute) }}</span>
            </td>
            <td class="px-2 py-2" v-if="day.breakTime && !day.isDayOff">
              <span>{{ getTimeString(day.breakTime.startHour, day.breakTime.startMinute) }}</span>
            </td>
            <td class="px-2 py-2" v-if="day.breakTime && !day.isDayOff">
              <span>{{ getTimeString(day.breakTime.endHour, day.breakTime.endMinute) }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="7" class="text-center">
              <CButton color="primary" @click="showScheduleModal = !showScheduleModal">{{ t("button.edit") }}</CButton>
            </td>
          </tr>
        </tbody>
      </table>

      <CModal :visible="showScheduleModal" size="xl" @close="saveSchedule">
        <CModalHeader> {{ t("form.label.schedule") }}</CModalHeader>
        <CModalBody>
          <CFormCheck
            v-if="showCompanyCheckbox"
            id="useCompanySchedule"
            class="mb-3"
            :label="t('form.label.use_company_schedule')"
            v-model="useCompanySchedule"
            @input="setCompanySchedule"
          />
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="px-2 py-2">{{ t("Day") }}</th>
                <th class="px-2 py-2">{{ t("Is day off") }}</th>
                <th class="px-2 py-2">{{ t("Break") }}</th>
                <th class="px-2 py-2">{{ t("Start time") }}</th>
                <th class="px-2 py-2">{{ t("End time") }}</th>
                <th class="px-2 py-2" v-if="showBreakTimeCols">{{ t("Break start") }}</th>
                <th class="px-2 py-2" v-if="showBreakTimeCols">{{ t("Break end") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in schedule?.days" :key="day.dayName" class="border-b">
                <td class="px-2 py-2">{{ t(capitalize(day.dayName)) }}</td>
                <td class="px-2 py-2">
                  <CFormCheck
                    v-if="!useCompanySchedule || editCompanySchedule"
                    v-model="day.isDayOff"
                    @change="(event) => updateSchedule(index, event.target.checked)"
                  />
                  <AdminYesNoBadge v-else :success="day.isDayOff" :isActiveLabel="false" />
                </td>
                <td class="px-2 py-2">
                  <CFormCheck
                    v-if="!useCompanySchedule || editCompanySchedule"
                    :checked="!!day.breakTime"
                    :disabled="day.isDayOff"
                    @change="(event) => addBreakTime(day, event.target.checked)"
                  />
                  <AdminYesNoBadge v-else :success="!!day.breakTime" :isActiveLabel="false" />
                </td>
                <td class="px-2 py-2" v-if="day.startHour !== null && day.startMinute !== null">
                  <CFormInput
                    v-if="!useCompanySchedule || editCompanySchedule"
                    type="time"
                    :value="getTimeString(day.startHour, day.startMinute)"
                    @input="updateTime(index, 'start', $event)"
                    :disabled="day.isDayOff"
                  />
                  <span v-else>{{ getTimeString(day.startHour, day.startMinute) }}</span>
                </td>
                <td class="px-2 py-2" v-if="day.endHour !== null && day.endMinute !== null">
                  <CFormInput
                    v-if="!useCompanySchedule || editCompanySchedule"
                    type="time"
                    :value="getTimeString(day.endHour, day.endMinute)"
                    @input="updateTime(index, 'end', $event)"
                    :disabled="day.isDayOff"
                  />
                  <span v-else>{{ getTimeString(day.endHour, day.endMinute) }}</span>
                </td>
                <td class="px-2 py-2" v-if="day.breakTime && !day.isDayOff">
                  <CFormInput
                    v-if="!useCompanySchedule || editCompanySchedule"
                    type="time"
                    :value="getTimeString(day.breakTime.startHour, day.breakTime.startMinute)"
                    @input="updateBreakTime(index, 'start', $event)"
                    :disabled="day.isDayOff"
                  />
                  <span v-else>{{ getTimeString(day.breakTime.startHour, day.breakTime.startMinute) }}</span>
                </td>
                <td class="px-2 py-2" v-if="day.breakTime && !day.isDayOff">
                  <CFormInput
                    v-if="!useCompanySchedule || editCompanySchedule"
                    type="time"
                    :value="getTimeString(day.breakTime.endHour, day.breakTime.endMinute)"
                    @input="updateBreakTime(index, 'end', $event)"
                    :disabled="day.isDayOff"
                  />
                  <span v-else>{{ getTimeString(day.breakTime.endHour, day.breakTime.endMinute) }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="7" class="text-center">
                  <CButton color="success" class="text-white" @click="saveSchedule">
                    {{ t("button.save") }}
                  </CButton>
                </td>
              </tr>
            </tbody>
          </table>
        </CModalBody>
      </CModal>
    </div>
  </div>
</template>
