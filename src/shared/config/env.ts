import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  // In production these MUST be set — no silent fallbacks
  jwtSecret: requireEnv(
    "JWT_SECRET",
    process.env.NODE_ENV === "production" ? undefined : "dev-secret-change-me"
  ),
  mongodbUri: requireEnv(
    "MONGODB_URI",
    process.env.NODE_ENV === "production"
      ? undefined
      : "mongodb://localhost:27017/personal-hud"
  ),
};
