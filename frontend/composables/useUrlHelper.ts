import { env } from "../../config/env";
export function useUrlHelper() {
  const { DEFAULT_LOCALE } = env;
  function getLocalizedUrl(url: string, locale: string) {
    return locale === DEFAULT_LOCALE ? url : "/" + locale + url;
  }
  function getLocalizedIndexUrl(locale: string) {
    return locale === DEFAULT_LOCALE ? "/" : "/" + locale;
  }

  return {
    getLocalizedUrl,
    getLocalizedIndexUrl,
  };
}
