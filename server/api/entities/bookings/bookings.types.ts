import { ProviderEntity } from "../providers/providers.types.ts";
import { ClientEntity } from "../clients/clients.types.ts";
import { ServiceEntity } from "../services/services.types.ts";
import { Document, ObjectId } from "mongoose";

export type Booking = Document<BookingEntity> & BookingEntity;
export interface BookingEntity {
  _id?: string;
  provider: ObjectId | ProviderEntity | null;
  services: ObjectId[] | ServiceEntity[];
  client: ObjectId | ClientEntity | null;
  startDate: string;
  endDate: string;
  clientComment: string;
  isDeclined: boolean;
  companySlug: string;
}
