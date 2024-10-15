import BaseController from "../../controller/BaseController.ts";
import { Service } from "./services.types.ts";
import Services from "./services.model.ts";

export default class ServicesController extends BaseController<Service> {
  constructor() {
    super(Services);
  }
}
