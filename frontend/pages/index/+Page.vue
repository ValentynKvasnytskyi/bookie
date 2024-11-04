<script setup lang="ts">
import { usePageContext } from "../../../renderer/usePageContext.ts";
import { env } from "../../../config/env.ts";
import { useTranslations } from "../../localization/useTranslations.ts";
import Logo from "../../components/Logo.vue";
import { useUrlHelper } from "../../composables/useUrlHelper.ts";

const pageContext = usePageContext();
const { t } = useTranslations(pageContext);
const { DEFAULT_LOCALE, SUPPORTED_LOCALES } = env;
const { getLocalizedUrl } = useUrlHelper();
</script>

<template>
  <section class="w-full px-8 text-gray-700 bg-white">
    <div class="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
      <Logo :locale="pageContext.locale" />
      <div class="flex gap-2">
        <a
          v-for="lang in SUPPORTED_LOCALES"
          :key="lang"
          :href="`/${lang !== DEFAULT_LOCALE ? lang : ''}`"
          class="text-indigo-600 font-semibold opa"
          :class="{
            'pointer-events-none': lang === pageContext.locale,
            'opacity-50': lang === pageContext.locale,
          }"
        >
          {{ lang.toUpperCase() }}
        </a>
      </div>
    </div>
  </section>

  <section class="px-2 py-32 bg-white md:px-0">
    <div class="container items-center max-w-6xl px-8 mx-auto xl:px-5">
      <div class="flex flex-wrap items-center sm:-mx-3">
        <div class="w-full md:w-full md:px-3 text-center">
          <div class="w-full pb-6 space-y-6 m-auto md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0 mb-4">
            <h1
              class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl"
            >
              <span class="block">{{ t("Landing hero title") }}</span>
              <span class="block text-indigo-600">Bookie.</span>
            </h1>
            <p class="mx-auto text-base text-gray-500 w-1/2 lg:max-w-lg lg:text-xl md:max-w-3xl">
              {{ t("Landing hero description") }}
            </p>
          </div>

          <div class="inline-flex items-center ml-auto mr-auto space-x-6 lg:justify-end">
            <a
              :href="getLocalizedUrl('/login', pageContext.locale)"
              class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              {{ t("Sign in") }}
            </a>
            <a
              :href="getLocalizedUrl('/register', pageContext.locale)"
              class="text-base font-medium leading-6 text-gray-600 whitespace-no-wrap transition duration-150 ease-in-out hover:text-gray-900"
            >
              {{ t("Sign up") }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
