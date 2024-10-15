import BaseController from "../../controller/BaseController.ts";
import Services from "./services.model.ts";
export default class ServicesController extends BaseController {
    constructor() {
        super(Services);
    }
}
