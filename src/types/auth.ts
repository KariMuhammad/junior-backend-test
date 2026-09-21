import type { Request } from "express";

import type { UserRole } from "../models/user.model";

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
