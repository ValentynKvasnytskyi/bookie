import BaseController from "../../controller/BaseController.ts";
import Bookings from "./bookings.model.ts";
export default class BookingsController extends BaseController {
    constructor(populateFields = []) {
        super(Bookings, populateFields);
    }
}
