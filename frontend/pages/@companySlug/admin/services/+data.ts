import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Service } from "../../../../../server/api/entities/services/services.types";

const servicesRepository = new EntityRepository<Service>("Services", ["category"]);

export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name, category, price, duration } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await servicesRepository.getAll({
    page,
    name,
    category,
    price,
    duration,
    companySlug,
  });

  return {
    services: data,
    totalItemsCount: totalCount,
  };
}
