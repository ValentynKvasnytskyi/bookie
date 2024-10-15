import BaseController from "../../controller/BaseController.ts";
import { Schedule } from "./schedules.types.ts";
import Schedules from "./schedules.model.ts";
export default class SchedulesController extends BaseController<Schedule> {
  constructor() {
    super(Schedules);
  }
}
