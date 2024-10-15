<script setup lang="ts">
import { ref } from "vue";
import { usePageContext } from "../../../../renderer/usePageContext";
import { env } from "../../../../config/env";
import ButtonGroup from "primevue/buttongroup";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Card from "primevue/card";
// refs
const email = ref("");
const password = ref("");
const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = env;
const pageContext = usePageContext();
const { locale, urlLogical } = pageContext.value;
async function login() {
  const log = await fetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
  console.log(await log.json());
}
// async function logout() {
//   const log = await fetch("/auth/logout", {
//     method: "POST",
//     body: JSON.stringify({
//       email: email.value,
//       password: pass.value,
//     }),
//     headers: {
//       "Content-type": "application/json",
//     },
//   });
//   console.log(await log.json());
// }
</script>
<template>
  <Card class="w-1/3 m-auto" role="login">
    <template #title>
      <div class="flex justify-between">
        <h1 class="text-2xl">Login</h1>
        <ButtonGroup>
          <a
            v-for="lang in SUPPORTED_LOCALES"
            :key="lang"
            :href="lang === DEFAULT_LOCALE ? '/login' : '/' + lang + urlLogical"
            class="p-button p-component p-button-link p-button-sm"
            :class="{ 'pointer-events-none': pageContext.locale === lang }"
          >
            {{ lang }}
          </a>
        </ButtonGroup>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 mt-2">
        <InputText v-model="email" fluid placeholder="Enter email" />

        <Password v-model="password" fluid :feedback="false" toggleMask placeholder="Enter password" />

        <Button label="Login" @click="login" />
        <div class="flex flex-col gap-2">
          <div class="text-xs text-center">
            New at bookie?
            <a href="/register" class="text-sky-500">Register</a>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
