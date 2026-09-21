import app from "./app";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  await connectToDatabase();

  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
}

void startServer().catch(async (error: unknown) => {
  console.error("Failed to start server", error);
  await disconnectFromDatabase();
  process.exitCode = 1;
});
