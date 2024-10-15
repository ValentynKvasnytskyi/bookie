import { ServiceEntity } from "../../../../../server/api/entities/services/services.types";
import { ScheduleEntity } from "../../../../../server/api/entities/schedules/schedules.types";
import { ProviderEntity } from "../../../../../server/api/entities/providers/providers.types";

export interface Data {
  provider: ProviderEntity | null;
  services: ServiceEntity[];
  companySchedule: ScheduleEntity | null;
}
