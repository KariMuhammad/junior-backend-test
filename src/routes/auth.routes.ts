import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { UserModel } from "../models/user.model";

const router = Router();

function isLoginBody(
  value: unknown,
): value is { email: string; password: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.email === "string" &&
    typeof body.password === "string" &&
    body.email.trim().length > 0 &&
    body.password.length > 0
  );
}

const loginRateLimit = rateLimit({
  windowMs: env.loginRateLimitWindowMs,
  limit: env.loginRateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({ message: "Too many login attempts" });
  },
});

router.post("/login", loginRateLimit, async (request, response) => {
  const body: unknown = request.body;

  if (!isLoginBody(body)) {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  const email = body.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  const passwordMatches = user
    ? await bcrypt.compare(body.password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    response.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] },
  );

  response.status(200).json({ token });
});

export default router;
