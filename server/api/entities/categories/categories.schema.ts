import mongoose from "mongoose";
import { Category } from "./categories.types.ts";

const { Schema } = mongoose;

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    companySlug: {
      type: String,
      index: true,
      required: true,
    },
  },
  { versionKey: false, collection: "categories" },
);

export default categorySchema;
