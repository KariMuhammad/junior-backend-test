import mongoose from "mongoose";

import { env } from "./env";

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: env.mongodbServerSelectionTimeoutMs,
  });
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
}
