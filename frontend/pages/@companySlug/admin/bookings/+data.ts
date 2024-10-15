import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import BookingsController from "../../../../../server/api/entities/bookings/bookings.controller";

const bookingsController = new BookingsController();

export async function data(pageContext: PageContext & ExtendedContext) {
  // const { page, name, category, price, duration } = pageContext.query;
  const { companySlug } = pageContext.routeParams;
  const { data, totalCount } = await bookingsController.getAllItemsSSR(
    {
      companySlug,
    },
    ["provider", "services", "client"],
  );

  return {
    bookings: data,
    totalItemsCount: totalCount,
  };
}
