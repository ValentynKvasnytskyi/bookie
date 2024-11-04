<script setup lang="ts">
import { BookingEntity } from "../../../../../server/api/entities/bookings/bookings.types.ts";
import { useData } from "../../../../../renderer/useData.ts";
import { Ref } from "vue";
import moment from "moment";
import { ServiceEntity } from "../../../../../server/api/entities/services/services.types.ts";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types.ts";
import { usePageContext } from "../../../../../renderer/usePageContext.ts";
import { useUrlHelper } from "../../../../composables/useUrlHelper.ts";

interface Data {
  booking: BookingEntity;
}
const data: Ref<Data> = useData();
const pageContext = usePageContext();
const { getLocalizedUrl } = useUrlHelper();
</script>
<template>
  <main class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 text-green-500">
          <i data-feather="check-circle" class="w-full h-full"></i>
        </div>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">Бронирование подтверждено!</h1>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Детали бронирования</h2>

          <dl class="space-y-4">
            <div class="flex justify-between">
              <dt class="text-gray-600">Услуга</dt>
              <dd class="font-medium text-gray-900">{{ data.booking.service.name }}</dd>
            </div>

            <div class="flex justify-between">
              <dt class="text-gray-600">Мастер</dt>
              <dd class="font-medium text-gray-900">{{ data.booking.provider.name }}</dd>
            </div>

            <div class="flex justify-between">
              <dt class="text-gray-600">Дата и время</dt>
              <dd class="font-medium text-gray-900">
                {{ moment.utc(data.booking.startDate).format("DD MMMM YYYY, HH:mm") }}
              </dd>
            </div>

            <div class="flex justify-between">
              <dt class="text-gray-600">Длительность</dt>
              <dd class="font-medium text-gray-900">{{ (data.booking.service as ServiceEntity).duration }} минут</dd>
            </div>

            <div class="flex justify-between">
              <dt class="text-gray-600">Стоимость</dt>
              <dd class="font-medium text-gray-900">{{ (data.booking.service as ServiceEntity).price }} ₴</dd>
            </div>

            <div class="pt-4 border-t" v-if="(data.booking.provider as ProviderEntity).phoneNumber">
              <h4 class="font-medium text-gray-900 mb-2">Контакты мастера</h4>
              <p class="text-gray-600">Телефон: {{ (data.booking.provider as ProviderEntity).phoneNumber }}</p>
            </div>
          </dl>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <a
          :href="getLocalizedUrl(`/${pageContext.routeParams.companySlug}/booking`, pageContext.locale)"
          class="w-full d-block text-center bg-white text-gray-900 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Вернуться на главную
        </a>
      </div>
    </div>
  </main>
</template>
