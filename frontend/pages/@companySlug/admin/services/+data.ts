import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import ServicesController from "../../../../../server/api/entities/services/services.controller.ts";

const servicesController = new ServicesController();

export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name, category, price, duration } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await servicesController.getAllItemsSSR(
    {
      page,
      name,
      category,
      price,
      duration,
      companySlug,
    },
    ["category"],
  );

  return {
    services: data,
    totalItemsCount: totalCount,
  };
}
