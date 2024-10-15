import BaseController from "../../controller/BaseController.ts";
import Categories from "./categories.model.ts";
export default class CategoriesController extends BaseController {
    constructor() {
        super(Categories);
    }
}
