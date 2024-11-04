import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import VikeRouterService from "../../../../services/VikeRouterService";

export function bookingRouter(pageContext: PageContext & ExtendedContext, route: any) {
  const { urlPathname } = pageContext;

  const matches = urlPathname.match(route.pattern);
  if (matches) {
    const params = route.parse(matches);

    const isValid = Object.entries(params).every(
      ([key, value]) => key === "companySlug" || VikeRouterService.isValidObjectId(value as string),
    );

    if (isValid) {
      return {
        routeParams: params,
        match: true,
      };
    }
  }

  return { match: false };
}
