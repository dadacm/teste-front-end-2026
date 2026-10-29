
import express from "express";
import { healthRouter } from "./routes/health/health.routes.js";

export const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use("/api/health", healthRouter);
