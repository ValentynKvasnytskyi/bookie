import mongoose from "mongoose";
import serviceSchema from "./services.schema.ts";

/**
 * Unbind all providers from deleted service
 */
serviceSchema.post("findOneAndDelete", async function (doc) {
  const ProvidersModel = mongoose.model("Providers");
  await ProvidersModel.updateMany({ services: doc._id }, { $pull: { services: doc._id } });
});

const Services = mongoose.models["Services"] || mongoose.model("Services", serviceSchema);
export default Services;
