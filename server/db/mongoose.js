import mongoose from "mongoose";
import { env } from "../../config/env.ts";
const clientOptions = {
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    },
    autoCreate: true,
    autoIndex: true,
};
const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI, clientOptions);
    }
    catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
    // finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
    // }
};
export { connectDB };
