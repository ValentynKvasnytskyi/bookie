import { Document, ObjectId } from "mongoose";
import { CategoryEntity } from "../categories/categories.types.ts";

export type Service = Document<ServiceEntity> & ServiceEntity;

export interface ServiceEntity {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  duration: number;
  category: ObjectId | CategoryEntity | null;
  companySlug: string;
  isActive?: boolean;
}
