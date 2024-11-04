import { ExtendedContext } from "../../../../../renderer/usePageContext";
import { PageContext } from "vike/types";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Company } from "../../../../../server/api/entities/companies/companies.types";

const companiesRepository = new EntityRepository<Company>("Companies", ["schedule"]);

export async function data(pageContext: PageContext & ExtendedContext) {
  const { companySlug } = pageContext.routeParams;

  const companiesList = await companiesRepository.getAll({ slug: companySlug });

  return {
    company: companiesList?.data?.[0] || null,
  };
}
