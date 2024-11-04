import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../../renderer/usePageContext";
import { ScheduleEntity } from "../../../../../server/api/entities/schedules/schedules.types";
import EntityRepository from "../../../../services/repository/EntityRepository";
import { Category } from "../../../../../server/api/entities/categories/categories.types";
import { Service } from "../../../../../server/api/entities/services/services.types";
import { Provider } from "../../../../../server/api/entities/providers/providers.types";
import { Booking } from "../../../../../server/api/entities/bookings/bookings.types";

const categoriesRepository = new EntityRepository<Category>("Categories");
const servicesRepository = new EntityRepository<Service>("Services");
const providersRepository = new EntityRepository<Provider>("Providers", ["services"]);
const bookingsRepository = new EntityRepository<Booking>("Bookings", [], { dateFields: ["startDate"] });

export async function data(pageContext: PageContext & ExtendedContext) {
  const { categoryId, serviceId, providerId } = pageContext.routeParams;

  const [category, service, provider, providerBookings] = await Promise.all([
    await categoriesRepository.getById(categoryId),
    await servicesRepository.getById(serviceId),
    await providersRepository.getById(providerId),
    await bookingsRepository.getAll({
      provider: providerId,
      pagination: false,
      "startDate[after]": new Date().toISOString(),
    }),
  ]);
  const busySlots = providerBookings.data.map((booking) => ({
    startDate: booking.startDate,
    endDate: booking.endDate,
  }));

  return {
    category,
    service,
    provider,
    busySlots,
    scheduleDays: (provider?.schedule as ScheduleEntity)?.days ?? [],
    serviceDuration: service?.duration ?? null,
  };
}
