import BaseController from "../../controller/BaseController.ts";
import { Category } from "./categories.types.ts";
import Categories from "./categories.model.ts";

export default class CategoriesController extends BaseController<Category> {
  constructor() {
    super(Categories);
  }
}
