import mongoose from "mongoose";
import providerSchema from "./providers.schema.ts";

providerSchema.pre("save", async function (next) {
  if (this.isModified("schedule")) {
    await handleSchedule(this);
  }
  next();
});

providerSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (update.schedule && typeof update.schedule === "object" && !update.schedule._id) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      doc.schedule = update.schedule;
      await handleSchedule(doc);
      update.schedule = doc.schedule;
    }
  }
  next();
});

async function handleSchedule(doc: any) {
  if (doc.schedule && typeof doc.schedule === "object" && !doc.schedule._id) {
    const Schedules = mongoose.model("Schedules");
    const newSchedule = new Schedules(doc.schedule);
    await newSchedule.save();
    doc.schedule = newSchedule._id;
  }
}

const Providers = mongoose.models["Providers"] || mongoose.model("Providers", providerSchema);
export default Providers;
