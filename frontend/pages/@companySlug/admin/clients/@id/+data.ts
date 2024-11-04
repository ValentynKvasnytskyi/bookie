import { PageContext } from "vike/types";
import EntityRepository from "../../../../../services/repository/EntityRepository";
import { Client } from "../../../../../../server/api/entities/clients/clients.types";

const clientsRepository = new EntityRepository<Client>("Clients");

export async function data(pageContext: PageContext) {
  const { id } = pageContext.routeParams;
  const client = await clientsRepository.getById(id);

  return {
    client,
  };
}
