import bcrypt from "bcryptjs";

import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database";
import { UserModel, type UserRole } from "./models/user.model";

function getCredential(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be set before seeding users`);
  }

  return value;
}

async function upsertUser(
  email: string,
  password: string,
  role: UserRole,
): Promise<void> {
  const passwordHash = await bcrypt.hash(password, 12);

  await UserModel.updateOne(
    { email },
    {
      $set: {
        email,
        passwordHash,
        role,
      },
    },
    { upsert: true, runValidators: true },
  );
}

async function seed(): Promise<void> {
  const adminEmail = getCredential("ADMIN_EMAIL").toLowerCase();
  const adminPassword = getCredential("ADMIN_PASSWORD");
  const userEmail = getCredential("USER_EMAIL").toLowerCase();
  const userPassword = getCredential("USER_PASSWORD");

  if (adminEmail === userEmail) {
    throw new Error("ADMIN_EMAIL and USER_EMAIL must be different");
  }

  await connectToDatabase();

  try {
    await upsertUser(adminEmail, adminPassword, "admin");
    await upsertUser(userEmail, userPassword, "user");
    console.log("Admin and user accounts are ready");
  } finally {
    await disconnectFromDatabase();
  }
}

void seed().catch((error: unknown) => {
  console.error("Failed to seed users", error);
  process.exitCode = 1;
});
