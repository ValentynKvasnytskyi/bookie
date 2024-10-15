import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import CategoriesController from "../../../../../server/api/entities/categories/categories.controller";

const categoriesController = new CategoriesController();
export async function data(pageContext: PageContext & ExtendedContext) {
  const { page, name } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await categoriesController.getAllItemsSSR({
    page,
    name,
    companySlug,
  });

  return {
    categories: data,
    totalItemsCount: totalCount,
  };
}
