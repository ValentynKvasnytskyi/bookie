import mongoose from "mongoose";
const { Schema } = mongoose;
const companySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    schedule: {
        type: Schema.Types.ObjectId,
        ref: "Schedules",
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
});
companySchema.index({ slug: 1 }, { unique: true });
export default companySchema;
