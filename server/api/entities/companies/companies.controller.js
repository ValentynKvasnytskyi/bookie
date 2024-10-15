import BaseController from "../../controller/BaseController.ts";
import Companies from "./companies.model.ts";
export default class CompaniesController extends BaseController {
    constructor(populateFields = []) {
        super(Companies, populateFields);
    }
}
