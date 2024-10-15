import { PageContext } from "vike/types";

const supportedLocales = ["ru", "uk"];
const defaultLocale = "ru";
export function onBeforeRoute(pageContext: PageContext) {
  const { urlPathname } = pageContext;
  const urlParts = urlPathname.split("/");

  let locale = defaultLocale;
  let urlWithoutLocale = urlPathname;

  if (urlParts[1] && supportedLocales.includes(urlParts[1])) {
    locale = urlParts[1];
    urlWithoutLocale = "/" + urlParts.slice(2).join("/");
  }

  if (urlWithoutLocale === "") {
    urlWithoutLocale = "/";
  }

  return {
    pageContext: {
      locale,
      urlLogical: urlWithoutLocale,
    },
  };
}
