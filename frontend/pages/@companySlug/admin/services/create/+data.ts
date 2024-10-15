import { PageContext } from "vike/types";
import CategoriesController from "../../../../../../server/api/entities/categories/categories.controller";

const categoriesController = new CategoriesController();
export async function data(pageContext: PageContext) {
  const { companySlug } = pageContext.routeParams;
  const categories = await categoriesController.getAllItemsSSR({ companySlug, pagination: "false" });

  return {
    categories: categories.data,
  };
}
