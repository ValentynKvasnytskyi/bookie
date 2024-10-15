import { Document, ObjectId } from "mongoose";
import { ServiceEntity } from "../services/services.types.ts";
import { ScheduleEntity } from "../schedules/schedules.types.ts";

export type Provider = Document<ProviderEntity> & ProviderEntity;
export interface ProviderEntity {
  _id?: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  isActive?: boolean;
  image?: string;
  services?: ObjectId[] | ServiceEntity[] | string[];
  schedule?: ObjectId | ScheduleEntity | null | string;
  companySlug: string;
}
