import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Client } from "../../../../../server/api/entities/clients/clients.types";

const clientsRepository = new EntityRepository<Client>("Clients");

export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name, email } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await clientsRepository.getAll({
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
