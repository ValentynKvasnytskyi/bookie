import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  password: string;
  refreshTokens?: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}
