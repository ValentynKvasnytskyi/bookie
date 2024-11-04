import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Service } from "../../../../../server/api/entities/services/services.types";

const servicesRepository = new EntityRepository<Service>("Services");

export async function data(pageContext: PageContext & ExtendedContext) {
  const { companySlug, categoryId } = pageContext.routeParams;
  const { data } = await servicesRepository.getAll({
    companySlug,
    category: categoryId,
  });

  return {
    services: data,
  };
}
