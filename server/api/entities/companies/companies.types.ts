import { Document } from "mongoose";
import { ScheduleEntity } from "../schedules/schedules.types.ts";

export type Company = Document<CompanyEntity> & CompanyEntity;
export interface CompanyEntity {
  _id?: string;
  name: string;
  description: string;
  phoneNumber: string;
  image?: string;
  email: string;
  schedule?: ScheduleEntity | null;
  slug: string;
}
