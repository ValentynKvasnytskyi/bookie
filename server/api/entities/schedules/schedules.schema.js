import mongoose from "mongoose";
const { Schema } = mongoose;
export const scheduleDaySchema = new Schema({
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
}, { versionKey: false, collection: "schedules" });
const schedulesSchema = new Schema({
    days: [scheduleDaySchema],
});
export default schedulesSchema;
