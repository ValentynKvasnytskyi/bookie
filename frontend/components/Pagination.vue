<script setup lang="ts">
import { CPagination, CPaginationItem } from "@coreui/vue";
import { useUrlHelper } from "../composables/useUrlHelper.ts";
import { computed } from "vue";
import { navigate } from "vike/client/router";
import { usePageContext } from "../../renderer/usePageContext.ts";

interface Props {
  itemsPerPage?: number;
  totalItems: number;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
});
const emit = defineEmits(["change-page"]);

const pageContext = usePageContext();
const { getLocalizedUrl } = useUrlHelper();

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const visiblePages = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  const page = Number(pageContext.value.query.page || 1);
  let start = Math.max(1, page - 1);
  const end = Math.min(start + 2, totalPages.value);

  if (end - start < 2) {
    start = Math.max(1, end - 2);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const middlePages = computed(() => {
  if (totalPages.value <= 7) return [];

  let start = Math.max(currentPage.value - 1, 2);
  const end = Math.min(start + 2, totalPages.value - 1);

  if (end - start < 2) {
    start = Math.max(2, end - 2);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const currentPage = computed(() => {
  return Number(pageContext.value.query.page) || 1;
});

const showLeftEllipsis = computed(() => {
  return totalPages.value > 7 && visiblePages.value[0] > 1 && currentPage.value > 3;
});

const showRightEllipsis = computed(() => {
  return (
    totalPages.value > 7 &&
    visiblePages.value[visiblePages.value.length - 1] < totalPages.value &&
    currentPage.value < totalPages.value - 2
  );
});

const showLastPage = computed(() => {
  return totalPages.value > 7;
});

async function goToPage(page: number) {
  const url = getLocalizedUrl(pageContext.value.urlLogical, pageContext.value.locale);
  const pageParam = page !== 1 ? `?page=${page}` : "";

  await navigate(url + pageParam);

  emit("change-page", page);
}
function prevPage() {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
}
</script>
<template>
  <CPagination class="mt-3 mx-auto flex justify-center">
    <CPaginationItem @click="prevPage" :disabled="currentPage === 1" :class="{ 'cursor-pointer': currentPage !== 1 }">
      Назад
    </CPaginationItem>

    <template v-if="totalPages <= 7">
      <CPaginationItem
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{
          active: currentPage === page,
          'cursor-pointer': currentPage !== page,
          'pointer-events-none': currentPage === page,
        }"
      >
        {{ page }}
      </CPaginationItem>
    </template>

    <template v-else>
      <template v-if="!middlePages.length">
        <CPaginationItem
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="{
            active: currentPage === page,
            'cursor-pointer': currentPage !== page,
            'pointer-events-none': currentPage === page,
          }"
        >
          {{ page }}
        </CPaginationItem>
      </template>
      <template v-else>
        <CPaginationItem
          @click="goToPage(1)"
          :class="{
            active: currentPage === 1,
          }"
        >
          1
        </CPaginationItem>
      </template>
      <CPaginationItem v-if="showLeftEllipsis">...</CPaginationItem>

      <CPaginationItem
        v-for="page in middlePages"
        :key="page"
        @click="goToPage(page)"
        :class="{
          active: currentPage === page,
          'cursor-pointer': currentPage !== page,
          'pointer-events-none': currentPage === page,
        }"
      >
        {{ page }}
      </CPaginationItem>

      <CPaginationItem v-if="showRightEllipsis">...</CPaginationItem>

      <CPaginationItem
        v-if="showLastPage"
        @click="goToPage(totalPages)"
        :class="{ active: currentPage === totalPages }"
      >
        {{ totalPages }}
      </CPaginationItem>
    </template>

    <CPaginationItem
      @click="nextPage"
      :disabled="currentPage === totalPages"
      :class="{ 'cursor-pointer': currentPage !== totalPages }"
    >
      Вперед
    </CPaginationItem>
  </CPagination>
</template>
