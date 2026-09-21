import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";
import { userRoles, type UserRole } from "../models/user.model";
import type { AuthenticatedRequest } from "../types/auth";

function isTokenPayload(
  payload: string | JwtPayload,
): payload is JwtPayload & { userId: string; role: UserRole } {
  return (
    typeof payload !== "string" &&
    typeof payload.userId === "string" &&
    userRoles.includes(payload.role as UserRole)
  );
}

export function requireAuthentication(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.header("authorization");

  if (!authorization || !/^Bearer\s+/i.test(authorization)) {
    response.status(401).json({ message: "Authentication required" });
    return;
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    response.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (!isTokenPayload(payload)) {
      response.status(401).json({ message: "Invalid token" });
      return;
    }

    request.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch {
    response.status(401).json({ message: "Invalid token" });
  }
}
