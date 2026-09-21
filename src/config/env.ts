import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const env = {
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product-inventory",
  mongodbServerSelectionTimeoutMs: Number(
    process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000,
  ),
  port: Number(process.env.PORT || 3000),
} as const;
