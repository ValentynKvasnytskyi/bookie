import { Ref } from "vue";
import { ExtendedContext } from "../../renderer/usePageContext.ts";

export function useTranslations(pageContext: Ref<ExtendedContext> | null = null) {
  const t = (key: string) => {
    return pageContext?.value.translations[pageContext?.value.locale]?.[key] || key;
  };

  return { t };
}
