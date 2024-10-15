import mongoose from "mongoose";
import { Client } from "./clients.types.ts";

const { Schema } = mongoose;

const clientSchema = new Schema<Client>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    companySlug: {
      type: String,
      index: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "clients" },
);

export default clientSchema;
