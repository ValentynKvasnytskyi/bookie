import { Document } from "mongoose";

export type Category = Document<CategoryEntity> & CategoryEntity;

export interface CategoryEntity {
  _id?: string;
  name: string;
  description: string;
  companySlug: string;
  isActive: boolean;
}
