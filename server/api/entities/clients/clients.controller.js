import BaseController from "../../controller/BaseController.ts";
import Clients from "./clients.model.ts";
export default class ClientsController extends BaseController {
    constructor() {
        super(Clients);
    }
}
