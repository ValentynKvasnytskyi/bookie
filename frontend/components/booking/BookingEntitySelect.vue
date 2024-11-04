<script setup lang="ts">
import { ServiceEntity } from "../../../server/api/entities/services/services.types";
import { CategoryEntity } from "../../../server/api/entities/categories/categories.types";
import { usePageContext } from "../../../renderer/usePageContext";
import { computed, ref, Ref } from "vue";
import { CButton, CCardTitle } from "@coreui/vue";
import Card from "../Card.vue";
import Multiselect from "vue-multiselect/src/Multiselect.vue";
import { useTranslations } from "../../localization/useTranslations";
import LangSwitcher from "../LangSwitcher.vue";
import { ProviderEntity } from "../../../server/api/entities/providers/providers.types.ts";
import { useUrlHelper } from "../../composables/useUrlHelper.ts";

interface Props {
  entities: CategoryEntity[] | ServiceEntity[] | ProviderEntity[];
  entitiesType: "categories" | "services" | "providers";
}

interface SelectOption {
  name: string;
  id: string;
}

// props
const props = defineProps<Props>();

// pageContext
const pageContext = usePageContext();

// translations
const { t } = useTranslations(pageContext);

// refs
const selectedItem: Ref<SelectOption | null> = ref(null);

// computed
const entitiesOptions = computed(() => getOptions(props.entities));
const acceptButtonUrl = computed(() => (selectedItem.value ? getUrl(selectedItem.value.id) : ""));

const { getLocalizedUrl } = useUrlHelper();

// methods
function getOptions(entities: CategoryEntity[] | ServiceEntity[] | ProviderEntity[]): SelectOption[] {
  return (
    entities?.map((entitie) => {
      let name = entitie.name;
      if (entitie.price) {
        name += " - " + entitie.price + "₴";
      }

      return { name, id: entitie._id as string };
    }) || []
  );
}

function getUrl(id: string) {
  const { companySlug, categoryId, serviceId } = pageContext.value.routeParams;
  const base = `/${companySlug}/booking/category`;

  const paths = {
    categories: () => `${base}/${id}`,
    services: () => (categoryId ? `${base}/${categoryId}/service/${id}` : ""),
    providers: () => (categoryId && serviceId ? `${base}/${categoryId}/service/${serviceId}/provider/${id}` : ""),
  };

  return paths[props.entitiesType]?.() ?? "";
}
</script>

<template>
  <Card class="w-50">
    <template #header>
      <CCardTitle class="text-xl">{{ t(`booking.choose.${entitiesType}`) }}</CCardTitle>
      <LangSwitcher />
    </template>
    <template #body>
      <Multiselect
        v-model="selectedItem"
        :options="entitiesOptions"
        :hide-selected="true"
        track-by="name"
        label="name"
        class="mb-3"
        :placeholder="t(`booking.placeholder.select_${entitiesType}`)"
      />
      <CButton
        color="success"
        class="text-white w-50 m-auto d-block"
        as="a"
        :disabled="!acceptButtonUrl"
        :href="getLocalizedUrl(acceptButtonUrl, pageContext.locale) as string"
      >
        {{ t(`button.accept`) }}
      </CButton>
    </template>
  </Card>
</template>
