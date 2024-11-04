import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserRole } from "./user.types.ts";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.COMPANY_ADMIN,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.isSuperAdmin = function (): boolean {
  return this.role === UserRole.SUPER_ADMIN;
};

UserSchema.methods.isCompanyAdmin = function (): boolean {
  return this.role === UserRole.COMPANY_ADMIN;
};

export default mongoose.model<IUser>("User", UserSchema);
