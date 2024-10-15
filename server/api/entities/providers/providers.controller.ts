import BaseController from "../../controller/BaseController.ts";
import { Provider } from "./providers.types.ts";
import Providers from "./providers.model.ts";

export class ProvidersController extends BaseController<Provider> {
  constructor() {
    super(Providers);
  }
}
