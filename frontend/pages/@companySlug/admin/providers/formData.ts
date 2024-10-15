import { PageContext } from "vike/types";
import { ProvidersController } from "../../../../../server/api/entities/providers/providers.controller";
import CompaniesController from "../../../../../server/api/entities/companies/companies.controller";
import ServicesController from "../../../../../server/api/entities/services/services.controller";

const providersController = new ProvidersController();
const companiesController = new CompaniesController();
const servicesController = new ServicesController();
export async function data(pageContext: PageContext) {
  const { id, companySlug } = pageContext.routeParams;
  let provider = null;
  if (id) {
    provider = await providersController.getItemByIdSSR(id, ["services", "schedule"]);
  }

  const [services, companies] = await Promise.all([
    await servicesController.getAllItemsSSR({ companySlug }),
    await companiesController.getAllItemsSSR({ slug: companySlug }, ["schedule"]),
  ]);

  const companySchedule = companies.data?.[0].schedule || null;

  return {
    provider,
    companySchedule,
    services: services.data,
  };
}
