import { PageContext } from "vike/types";
import BookingsController from "../../../../../../server/api/entities/bookings/bookings.controller";

const bookingsController = new BookingsController();
export async function data(pageContext: PageContext) {
  const { id } = pageContext.routeParams;
  const booking = await bookingsController.getItemByIdSSR(id, ["client", "services", "provider"]);

  return {
    booking,
  };
}
