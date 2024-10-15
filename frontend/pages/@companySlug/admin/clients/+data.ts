import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import ClientsController from "../../../../../server/api/entities/clients/clients.controller";

const clientsController = new ClientsController();
export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name, email } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await clientsController.getAllItemsSSR({
    page,
    name,
    email,
    companySlug,
  });

  return {
    clients: data,
    totalItemsCount: totalCount,
  };
}
