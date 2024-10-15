import BaseController from "../../controller/BaseController.ts";
import Clients from "./clients.model.ts";
import { Client } from "./clients.types.ts";

export default class ClientsController extends BaseController<Client> {
  constructor() {
    super(Clients);
  }
}
