import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Category } from "../../../../../server/api/entities/categories/categories.types";

const categoriesRepository = new EntityRepository<Category>("Categories");
export async function data(pageContext: PageContext & ExtendedContext) {
  const { companySlug } = pageContext.routeParams;
  const { data } = await categoriesRepository.getAll({
    companySlug,
  });

  return {
    categories: data,
  };
}
