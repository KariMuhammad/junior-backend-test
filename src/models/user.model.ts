import { model, Schema } from "mongoose";

export const userRoles = ["admin", "user"] as const;

export type UserRole = (typeof userRoles)[number];

export interface User {
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: userRoles,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<User>("User", userSchema);
