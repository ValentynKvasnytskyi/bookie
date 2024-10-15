import BaseController from "../../controller/BaseController.ts";
import Schedules from "./schedules.model.ts";
export default class SchedulesController extends BaseController {
    constructor() {
        super(Schedules);
    }
}
