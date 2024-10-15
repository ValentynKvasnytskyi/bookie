import { ExtendedContext } from "../../../../../renderer/usePageContext";
import CompaniesController from "../../../../../server/api/entities/companies/companies.controller";
import { PageContext } from "vike/types";

const companiesController = new CompaniesController();

export async function data(pageContext: PageContext & ExtendedContext) {
  const { companySlug } = pageContext.routeParams;

  const companiesList = await companiesController.getAllItemsSSR({ slug: companySlug }, ["schedule"]);

  return {
    company: companiesList?.data?.[0] || null,
  };
}
