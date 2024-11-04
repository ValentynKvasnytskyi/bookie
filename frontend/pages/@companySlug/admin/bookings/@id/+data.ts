import { PageContext } from "vike/types";
import EntityRepository from "../../../../../services/repository/EntityRepository";
import { Booking } from "../../../../../../server/api/entities/bookings/bookings.types";

const bookingsRepository = new EntityRepository<Booking>("Bookings", ["client", "service", "provider"]);

export async function data(pageContext: PageContext) {
  const { id } = pageContext.routeParams;
  const booking = await bookingsRepository.getById(id);

  return {
    booking,
  };
}
