import mongoose from "mongoose";
import providerSchema from "./providers.schema.ts";
providerSchema.post("save", async function (doc) {
    const Services = mongoose.model("Services");
    await Services.updateMany({ _id: { $in: doc.services } }, { $addToSet: { providers: doc._id } });
});
providerSchema.post("findOneAndUpdate", async function (doc) {
    const Services = mongoose.model("Services");
    await Services.updateMany({ _id: { $in: doc.services } }, { $addToSet: { providers: doc._id } });
});
providerSchema.post("findOneAndDelete", async function (doc) {
    const Services = mongoose.model("Services");
    await Services.updateMany({ _id: { $in: doc.services } }, { $pull: { providers: doc._id } });
});
const Providers = mongoose.model("Providers", providerSchema);
export default Providers;
