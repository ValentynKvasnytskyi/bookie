import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Provider } from "../../../../../server/api/entities/providers/providers.types";

const providersRepository = new EntityRepository<Provider>("Providers");

export async function data(pageContext: PageContext & ExtendedContext) {
  const { companySlug, serviceId } = pageContext.routeParams;
  const { data } = await providersRepository.getAll({ companySlug, services: serviceId });

  return {
    providers: data,
  };
}
