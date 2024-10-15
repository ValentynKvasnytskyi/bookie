import BaseController from "../../controller/BaseController.ts";
import { Booking } from "./bookings.types.ts";
import Bookings from "./bookings.model.ts";

export default class BookingsController extends BaseController<Booking> {
  constructor(populateFields: string[] = []) {
    super(Bookings, populateFields);
  }
}
