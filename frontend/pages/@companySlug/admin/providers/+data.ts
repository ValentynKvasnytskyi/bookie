import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import { ProvidersController } from "../../../../../server/api/entities/providers/providers.controller";

const providersController = new ProvidersController();

export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name, email, phoneNumber } = pageContext.query;
  const { companySlug } = pageContext.routeParams;

  const { data, totalCount } = await providersController.getAllItemsSSR(
    {
      page,
      name,
      email,
      phoneNumber,
      companySlug,
    },
    ["services", "schedule"],
  );

  return {
    providers: data,
    totalItemsCount: totalCount,
  };
}
