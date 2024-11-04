import { PageContext } from "vike/types";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Provider } from "../../../../../server/api/entities/providers/providers.types";
import { Company } from "../../../../../server/api/entities/companies/companies.types";
import { Service } from "../../../../../server/api/entities/services/services.types";

const providersRepository = new EntityRepository<Provider>("Providers", ["services", "schedule"]);
const companiesRepository = new EntityRepository<Company>("Companies", ["schedule"]);
const servicesRepository = new EntityRepository<Service>("Services");

export async function data(pageContext: PageContext) {
  const { id, companySlug } = pageContext.routeParams;
  let provider = null;
  if (id) {
    provider = await providersRepository.getById(id);
  }

  const [services, companies] = await Promise.all([
    await servicesRepository.getAll({ companySlug }),
    await companiesRepository.getAll({ slug: companySlug }),
  ]);

  const companySchedule = companies.data?.[0].schedule || null;

  return {
    provider,
    companySchedule,
    services: services.data,
  };
}
