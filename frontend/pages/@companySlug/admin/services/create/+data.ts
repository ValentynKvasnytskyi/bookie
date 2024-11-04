import { PageContext } from "vike/types";
import EntityRepository from "../../../../../services/repository/EntityRepository";
import { Category } from "../../../../../../server/api/entities/categories/categories.types";

const categoriesRepository = new EntityRepository<Category>("Categories");

export async function data(pageContext: PageContext) {
  const { companySlug } = pageContext.routeParams;
  const categories = await categoriesRepository.getAll({ companySlug, pagination: "false" });

  return {
    categories: categories.data,
  };
}
