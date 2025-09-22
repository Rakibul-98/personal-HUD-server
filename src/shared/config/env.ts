import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "secret",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/personal-hud",
};
