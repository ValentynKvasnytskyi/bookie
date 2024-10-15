import { PageContext } from "vike/types";
import ServicesController from "../../../../../../server/api/entities/services/services.controller.ts";
import CategoriesController from "../../../../../../server/api/entities/categories/categories.controller.ts";

const servicesController = new ServicesController();
const categoriesController = new CategoriesController();
export async function data(pageContext: PageContext) {
  const { id, companySlug } = pageContext.routeParams;
  const service = await servicesController.getItemByIdSSR(id);
  const categories = await categoriesController.getAllItemsSSR({ companySlug, pagination: "false" });

  return {
    service,
    categories: categories.data,
  };
}
