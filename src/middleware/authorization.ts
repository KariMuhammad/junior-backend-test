import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "../types/auth";

export function requireAdmin(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void {
  if (!request.user) {
    response.status(401).json({ message: "Authentication required" });
    return;
  }

  if (request.user.role !== "admin") {
    response.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
}
