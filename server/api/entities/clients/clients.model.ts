import mongoose from "mongoose";
import clientSchema from "./clients.schema.ts";

const Clients = mongoose.models["Clients"] || mongoose.model("Clients", clientSchema);
export default Clients;