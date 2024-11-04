import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Provider } from "../../../../../server/api/entities/providers/providers.types";

const providersRepository = new EntityRepository<Provider>("Providers", ["services", "schedule"]);

export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name, email, phoneNumber } = pageContext.query;
  const { companySlug } = pageContext.routeParams;

  const { data, totalCount } = await providersRepository.getAll({
    page,
    name,
    email,
    phoneNumber,
    companySlug,
  });

  return {
    providers: data,
    totalItemsCount: totalCount,
  };
}
