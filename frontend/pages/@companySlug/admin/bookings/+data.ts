import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Booking } from "../../../../../server/api/entities/bookings/bookings.types";

const bookingRepository = new EntityRepository<Booking>("Bookings", ["provider", "service", "client"]);

export async function data(pageContext: PageContext & ExtendedContext) {
  // const { page, name, category, price, duration } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await bookingRepository.getAll({
    companySlug,
  });

  return {
    bookings: data,
    totalItemsCount: totalCount,
  };
}
