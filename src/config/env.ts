import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const env = {
  mongodbUri:
    process.env.MONGODB_URI ??
    "mongodb://127.0.0.1:27017/product-inventory",
} as const;
