import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI as string;

  mongoose.connection.on("connected", () =>
    console.log("MongoDB connected")
  );
  mongoose.connection.on("disconnected", () =>
    console.log("MongoDB disconnected — attempting reconnect...")
  );
  mongoose.connection.on("error", (err) =>
    console.log(`MongoDB error: ${err.message}`)
  );

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};
