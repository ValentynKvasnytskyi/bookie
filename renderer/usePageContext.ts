// https://vike.dev/usePageContext
import { Translations } from "../server/services/translations.ts";

export { usePageContext };
export { setPageContext };

import { inject } from "vue";
import type { App, InjectionKey, Ref } from "vue";
import type { PageContext } from "vike/types";

export interface ExtendedContext {
  locale: string;
  translations: Translations;
  urlLogical: string;
  query: Record<string, string>;
}

const key: InjectionKey<Ref<PageContext>> = Symbol();

/** https://vike.dev/usePageContext */
function usePageContext(): Ref<PageContext & ExtendedContext> {
  const pageContext = inject(key);
  if (!pageContext) throw new Error("setPageContext() not called in parent");
  return pageContext as Ref<PageContext & ExtendedContext>;
}

function setPageContext(app: App, pageContext: Ref<PageContext>): void {
  app.provide(key, pageContext);
}
