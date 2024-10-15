import mongoose from "mongoose";
import { Provider } from "./providers.types.ts";

const { Schema } = mongoose;

const providerSchema = new Schema<Provider>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
    services: {
      type: [Schema.Types.ObjectId],
      ref: "Services",
      default: null,
    },
    schedule: {
      type: Schema.Types.Mixed,
      required: true,
      ref: "Schedules",
    },
    companySlug: {
      type: String,
      index: true,
      required: true,
    },
  },
  { versionKey: false, collection: "providers" },
);

export default providerSchema;
