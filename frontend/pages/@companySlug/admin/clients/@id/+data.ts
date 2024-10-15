import { PageContext } from "vike/types";
import ClientsController from "../../../../../../server/api/entities/clients/clients.controller";

const clientsController = new ClientsController();
export async function data(pageContext: PageContext) {
  const { id } = pageContext.routeParams;
  const client = await clientsController.getItemByIdSSR(id);

  return {
    client,
  };
}
