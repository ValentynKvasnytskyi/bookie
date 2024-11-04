import { createPinia } from "pinia";
import { createSSRApp, h, shallowRef } from "vue";
import { setPageContext } from "./usePageContext";
import { setData } from "./useData";
import type { PageContext } from "vike/types";
import { objectAssign } from "./utils";

export { createVueApp };

function createVueApp(pageContext: PageContext) {
  const pageContextRef = shallowRef(pageContext);
  const dataRef = shallowRef(pageContext.data);
  const pageRef = shallowRef(pageContext.Page);
  const LayoutComponent = shallowRef(pageContext?.config?.Layout?.[0] as any);

  const RootComponent = () => h(LayoutComponent.value, null, () => h(pageRef.value));
  const app = createSSRApp(RootComponent);

  const pinia = createPinia();
  app.use(pinia);

  // TODO: use prime vue after ssr styles rendering fix
  // app.use(PrimeVue, {
  //   // unstyled: true,
  //   theme: {
  //     preset: Aura,
  //     options: {
  //       darkModeSelector: "",
  //       cssLayer: false,
  //     },
  //   },
  // });

  setPageContext(app, pageContextRef);
  setData(app, dataRef);

  // app.changePage() is called upon navigation, see +onRenderClient.ts
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      pageContextRef.value = pageContext;
      dataRef.value = pageContext.data;
      pageRef.value = pageContext.Page;
      LayoutComponent.value = pageContext?.config?.Layout?.[0];
    },
  });

  return app;
}
