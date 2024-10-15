import BaseController from "../../controller/BaseController.ts";
import { Company } from "./companies.types.ts";
import Companies from "./companies.model.ts";
export default class CompaniesController extends BaseController<Company> {
  constructor(populateFields: string[] = []) {
    super(Companies, populateFields);
  }
}
