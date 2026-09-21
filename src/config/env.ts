import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const env = {
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product-inventory",
  mongodbServerSelectionTimeoutMs: Number(
    process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000,
  ),
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  loginRateLimitWindowMs: Number(
    process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 900000,
  ),
  loginRateLimitMax: Number(process.env.LOGIN_RATE_LIMIT_MAX || 5),
} as const;
