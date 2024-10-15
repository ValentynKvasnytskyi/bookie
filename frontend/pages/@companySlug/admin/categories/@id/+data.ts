import { PageContext } from "vike/types";
import CategoriesController from "../../../../../../server/api/entities/categories/categories.controller";

const categoriesController = new CategoriesController();
export async function data(pageContext: PageContext) {
  const { id } = pageContext.routeParams;
  const category = await categoriesController.getItemByIdSSR(id);

  return {
    category,
  };
}
