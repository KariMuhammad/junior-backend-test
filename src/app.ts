import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middleware/error-handler";
import authRouter from "./routes/auth.routes";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ data: { status: "ok" } });
});

app.use("/auth", authRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
