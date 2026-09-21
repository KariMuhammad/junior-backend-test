import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ message: "Invalid JSON payload" });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error" });
};
