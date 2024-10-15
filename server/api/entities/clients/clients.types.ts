import { Document } from "mongoose";

export type Client = Document<ClientEntity> & ClientEntity;
export interface ClientEntity {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  companySlug: string;
}
