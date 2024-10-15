import mongoose from "mongoose";
const { Schema } = mongoose;
const categorySchema = new Schema({
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
}, { versionKey: false, collection: "categories" });
export default categorySchema;
