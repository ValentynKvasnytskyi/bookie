import mongoose from "mongoose";
import categorySchema from "./categories.schema.ts";

/**
 * Unbind all services from deleted category
 */
categorySchema.post("findOneAndDelete", async function (doc) {
  const ServicesModel = mongoose.models.Services || mongoose.model("Services");

  const services = await ServicesModel.find({ category: doc._id });

  await ServicesModel.updateMany({ _id: { $in: services.map((service) => service._id) } }, { category: null });
});

const Categories = mongoose.models["Categories"] || mongoose.model("Categories", categorySchema);

export default Categories;
