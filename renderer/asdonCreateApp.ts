import { PageContext } from "vike/types";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

const asdonCreateApp = (pageContext: PageContext) => {
  const { app } = pageContext;
  const pinia = createPinia();
  app.use(pinia);
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: "",
      },
    },
    ripple: true,
  });
};

export { asdonCreateApp };
