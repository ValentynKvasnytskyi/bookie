import BaseController from "../../controller/BaseController.ts";
import Providers from "./providers.model.ts";
export class ProvidersController extends BaseController {
    constructor() {
        super(Providers);
    }
}
