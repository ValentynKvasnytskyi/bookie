import { Document, Types } from "mongoose";
import { CompanyEntity } from "../../api/entities/companies/companies.types.ts";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  COMPANY_ADMIN = "company_admin",
  MANAGER = "manager",
  EMPLOYEE = "employee",
}

export type IUser = Document<UserEntity> &
  UserEntity & { comparePassword(candidatePassword: string): Promise<boolean> };
export interface UserEntity {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company: Types.ObjectId | CompanyEntity | null;
  refreshTokens?: string[];
  lastLogin?: Date;
  isActive: boolean;
}
