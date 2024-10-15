import mongoose from "mongoose";
import { Service } from "./services.types.ts";

const { Schema } = mongoose;

const serviceSchema = new Schema<Service>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      index: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    companySlug: {
      type: String,
      index: true,
      required: true,
    },
  },
  { versionKey: false, collection: "services" },
);

export default serviceSchema;
