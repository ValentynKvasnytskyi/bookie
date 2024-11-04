import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import { bookingRouter } from "../router";

const routeObject = {
  pattern: /^\/([^/]+)\/booking\/category\/([^/]+)$/,
  parse: (matches: RegExpMatchArray) => ({
    companySlug: matches[1],
    categoryId: matches[2],
  }),
};

export function route(pageContext: PageContext & ExtendedContext) {
  return bookingRouter(pageContext, routeObject);
}