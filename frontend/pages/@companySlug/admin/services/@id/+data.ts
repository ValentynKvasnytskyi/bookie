import { PageContext } from "vike/types";
import EntityRepository from "../../../../../services/repository/EntityRepository";
import { Category } from "../../../../../../server/api/entities/categories/categories.types";
import { Service } from "../../../../../../server/api/entities/services/services.types";

const categoriesRepository = new EntityRepository<Category>("Categories");
const servicesRepository = new EntityRepository<Service>("Services");

export async function data(pageContext: PageContext) {
  const { id, companySlug } = pageContext.routeParams;
  const service = await servicesRepository.getById(id);
  const categories = await categoriesRepository.getAll({ companySlug, pagination: "false" });

  return {
    service,
    categories: categories.data,
  };
}
