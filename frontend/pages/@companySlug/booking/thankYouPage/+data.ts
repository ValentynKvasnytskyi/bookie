import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Booking } from "../../../../../server/api/entities/bookings/bookings.types";

const bookingRepository = new EntityRepository<Booking>("Bookings", ["service", "provider", "client"]);

export async function data(pageContext: PageContext & ExtendedContext) {
  const { bookingId } = pageContext.routeParams;

  const booking = await bookingRepository.getById(bookingId);

  return {
    booking,
  };
}
