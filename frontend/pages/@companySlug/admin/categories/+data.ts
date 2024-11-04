import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import { Category } from "../../../../../server/api/entities/categories/categories.types";
import EntityRepository from "../../../../services/repository/EntityRepository";

const categoriesRepository = new EntityRepository<Category>("Categories");

export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await categoriesRepository.getAll({
    page,
    name,
    companySlug,
  });

  return {
    categories: data,
    totalItemsCount: totalCount,
  };
}
