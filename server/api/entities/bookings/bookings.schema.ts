import mongoose from "mongoose";
import { Booking } from "./bookings.types.ts";

const { Schema } = mongoose;

const bookingSchema = new Schema<Booking>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Providers",
      required: true,
      index: true,
    },
    services: {
      type: [Schema.Types.ObjectId],
      ref: "Services",
      required: true,
      index: true,
    },
    client: {
      type: Schema.Types.Mixed,
      ref: "Clients",
      required: true,
      index: true,
    },
    startDate: {
      type: String,
      required: true,
      index: true,
    },
    endDate: {
      type: String,
      required: true,
      index: true,
    },
    clientComment: {
      type: String,
    },
    isDeclined: {
      type: Boolean,
      default: false,
    },
    companySlug: {
      type: String,
      index: true,
      required: true,
    },
  },
  { versionKey: false, collection: "bookings" },
);

bookingSchema.index({ provider: 1, startDate: 1, endDate: 1 });

export default bookingSchema;
