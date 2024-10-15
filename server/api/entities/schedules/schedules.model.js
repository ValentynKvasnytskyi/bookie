import mongoose from "mongoose";
import schedulesSchema from "./schedules.schema.ts";
const Schedules = mongoose.model("Schedules", schedulesSchema);
export default Schedules;
