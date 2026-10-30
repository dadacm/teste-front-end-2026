
import express from "express";
import { healthRouter } from "./routes/health/health.routes.js";
import type { DatabaseSync } from "node:sqlite";
import { createAuthRouter } from "./routes/auth/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp(database: DatabaseSync) {
    const app = express();

    app.disable("x-powered-by");
    app.use(express.json({ limit: "16kb" }));

    app.use("/api/health", healthRouter);
    app.use("/api/auth", createAuthRouter(database));

    app.use(errorHandler);

    return app;

}