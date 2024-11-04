<script setup lang="ts">
import { ref } from "vue";
import { usePageContext } from "../../../../renderer/usePageContext";
import { env } from "../../../../config/env";
import { CCard, CCardTitle, CCardBody, CButton, CFormInput, CRow, CCol, CCardHeader } from "@coreui/vue";
import { navigate } from "vike/client/router";
import { useUrlHelper } from "../../../composables/useUrlHelper.ts";
import { useTranslations } from "../../../localization/useTranslations.ts";
import LangSwitcher from "../../../components/LangSwitcher.vue";
// refs
const email = ref("");
const password = ref("");
const pageContext = usePageContext();
const { getLocalizedUrl, getLocalizedIndexUrl } = useUrlHelper();
const { t } = useTranslations(pageContext);
async function login() {
  const response = await fetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const user = await response.json();

  if (user?.company?.slug) {
    await navigate(getLocalizedUrl(`/${user.company.slug}/admin`, pageContext.value.locale));
  } else {
    await navigate(getLocalizedUrl(`/register`, pageContext.value.locale));
  }
}
</script>
<template>
  <CCard class="md:w-1/2 sm:w-2/3 m-auto">
    <CCardHeader class="flex align-items-center justify-between">
      <CCardTitle class="mb-0 text-2xl font-semibold">
        {{ t("auth.title.login") }}
      </CCardTitle>
      <LangSwitcher />
    </CCardHeader>
    <CCardBody class="pt-2">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <CRow class="pb-4 border-b gap-y-4">
            <CCol sm="12">
              <CFormInput v-model="email" :placeholder="t('auth.placeholder.email')" />
            </CCol>
            <CCol sm="12">
              <CFormInput type="password" v-model="password" :placeholder="t('auth.placeholder.password')" />
            </CCol>
          </CRow>

          <CButton color="success" class="text-white" @click="login">{{ t("auth.button.login") }}</CButton>
          <div class="text-xs text-center">
            {{ t("auth.text.login") }}
            <a :href="getLocalizedUrl('/register', pageContext.locale)" class="text-sky-500">{{
              t("auth.title.register")
            }}</a>
          </div>
          <div class="text-xs text-center">
            <a :href="getLocalizedIndexUrl(pageContext.locale)" class="text-sky-500">{{ t("auth.title.main") }}</a>
          </div>
        </div>
      </div>
    </CCardBody>
  </CCard>
</template>
