<script setup lang="ts">
import { Ref, ref } from "vue";
import { CCard, CCardTitle, CCardBody, CButton, CFormInput, CRow, CCol, CCardHeader } from "@coreui/vue";
import { UserEntity, UserRole } from "../../../../server/auth/user/user.types";
import { CompanyEntity } from "../../../../server/api/entities/companies/companies.types.ts";
import { navigate } from "vike/client/router";
import { useTranslations } from "../../../localization/useTranslations.ts";
import { usePageContext } from "../../../../renderer/usePageContext.ts";
import { useUrlHelper } from "../../../composables/useUrlHelper.ts";
import LangSwitcher from "../../../components/LangSwitcher.vue";
import { ApiService } from "../../../services/ApiService.ts";

const pageContext = usePageContext();
const { t } = useTranslations(pageContext);
const { getLocalizedUrl, getLocalizedIndexUrl } = useUrlHelper();
const apiService = new ApiService("companies");
const companyExists = ref(false);
let lastTimeoutId: NodeJS.Timeout;

const user: Ref<UserEntity> = ref({
  name: "",
  email: "",
  password: "",
  role: "",
  company: null,
  isActive: true,
});
const passwordConfirmation = ref("");

const company: Ref<CompanyEntity> = ref({
  name: "",
  phoneNumber: "",
  description: "",
  email: "",
  slug: "",
  schedule: null,
});

async function register() {
  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: user.value.name,
        email: user.value.email,
        password: user.value.password,
        role: UserRole.COMPANY_ADMIN,
        companyData: {
          ...company.value,
          slug: company.value.slug.toLowerCase(),
        },
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      await navigate("/login");
    }
  } catch (e) {
    console.log(e);
  }
}

async function checkUniqueCompanySlug(slug: string) {
  if (lastTimeoutId) {
    clearTimeout(lastTimeoutId);
  }

  lastTimeoutId = setTimeout(async () => {
    const response = await apiService.checkExistence("company", { slug });
    if (response) {
      companyExists.value = response.exists;
    }
  }, 300);
}
</script>
<template>
  <CCard class="w-9/12 m-auto">
    <CCardHeader class="flex align-items-center justify-between">
      <CCardTitle class="mb-0 text-2xl font-semibold">
        {{ t("auth.title.register") }}
      </CCardTitle>
      <LangSwitcher />
    </CCardHeader>
    <CCardBody class="pt-2">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <CRow class="pb-4 border-b gap-y-4">
            <CCardTitle class="font-semibold mb-0"> {{ t("auth.title.user_info") }} </CCardTitle>
            <CCol sm="6">
              <CFormInput v-model="user.name" :label="t('auth.label.user.name')" />
            </CCol>
            <CCol sm="6">
              <CFormInput v-model="user.email" :label="t('auth.label.user.email')" />
            </CCol>
            <CCol sm="6">
              <CFormInput type="password" v-model="user.password" :label="t('auth.label.user.password')" />
            </CCol>
            <CCol sm="6">
              <CFormInput
                type="password"
                v-model="passwordConfirmation"
                :label="t('auth.label.user.passwordConfirmation')"
                :invalid="user.password !== passwordConfirmation"
                :feedback-invalid="t('auth.password.confirmation')"
              />
            </CCol>
          </CRow>

          <CRow class="pt-4 gap-y-4 mb-4">
            <CCardTitle class="font-semibold mb-0"> {{ t("auth.title.company_info") }} </CCardTitle>
            <CCol sm="6">
              <CFormInput v-model="company.name" :label="t('auth.label.company.name')" />
            </CCol>
            <CCol sm="6">
              <CFormInput v-model="company.email" :label="t('auth.label.company.email')" />
            </CCol>
            <CCol sm="6">
              <CFormInput v-model="company.phoneNumber" :label="t('auth.label.company.phoneNumber')" />
            </CCol>
            <CCol sm="6">
              <CFormInput
                v-model="company.slug"
                :label="t('auth.label.company.slug')"
                @update:modelValue="checkUniqueCompanySlug"
                :invalid="companyExists"
                :valid="!companyExists && company.slug.length > 0"
                :feedback-invalid="t('auth.slug.exists')"
              />
            </CCol>
          </CRow>

          <CButton
            color="info"
            class="text-white"
            @click="register"
            :disabled="!user.password || user.password !== passwordConfirmation || companyExists"
          >
            {{ t("auth.button.register") }}
          </CButton>

          <div class="text-xs text-center">
            {{ t("auth.text.register") }}
            <a :href="getLocalizedUrl('/login', pageContext.locale)" class="text-sky-500">
              {{ t("auth.title.login") }}
            </a>
          </div>
          <div class="text-xs text-center">
            <a :href="getLocalizedIndexUrl(pageContext.locale)" class="text-sky-500">{{ t("auth.title.main") }}</a>
          </div>
        </div>
      </div>
    </CCardBody>
  </CCard>
</template>
