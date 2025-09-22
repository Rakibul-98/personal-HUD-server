import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/personal-hud",
};
