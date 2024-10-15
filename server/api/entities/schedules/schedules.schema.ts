import mongoose from "mongoose";
import { Schedule, ScheduleDay } from "./schedules.types.ts";

const { Schema } = mongoose;

export const scheduleDaySchema = new Schema<ScheduleDay>(
  {
    startHour: Number,
    endHour: Number,
    startMinute: {
      type: Number,
      default: 0,
    },
    endMinute: {
      type: Number,
      default: 0,
    },
    dayName: String,
    isDayOff: {
      type: Boolean,
      required: true,
      default: false,
    },
    index: Number,
    breakTime: {
      startHour: {
        type: Number,
      },
      endHour: {
        type: Number,
      },
      startMinute: {
        type: Number,
      },
      endMinute: {
        type: Number,
      },
    },
  },
  { versionKey: false, collection: "schedules" },
);

const schedulesSchema = new Schema<Schedule>({
  days: [scheduleDaySchema],
});

export default schedulesSchema;
