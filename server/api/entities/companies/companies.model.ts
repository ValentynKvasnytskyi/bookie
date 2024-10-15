import mongoose from "mongoose";
import companySchema from "./companies.schema.ts";

// companySchema.pre("create", () => {});

const Companies = mongoose.models["Companies"] || mongoose.model("Companies", companySchema);

//   .catch((err) => console.error("Index synchronization error:", err));
export default Companies;
