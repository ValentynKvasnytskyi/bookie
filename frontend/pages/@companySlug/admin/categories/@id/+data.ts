import { PageContext } from "vike/types";
import EntityRepository from "../../../../../services/repository/EntityRepository";
import { Category } from "../../../../../../server/api/entities/categories/categories.types";

const categoriesRepository = new EntityRepository<Category>("Categories");

export async function data(pageContext: PageContext) {
  const { id } = pageContext.routeParams;
  const category = await categoriesRepository.getById(id);

  return {
    category,
  };
}
