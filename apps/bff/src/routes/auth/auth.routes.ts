
import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";

import {
  loginSchema,
  registerSchema,
} from "./auth.schemas.js";

import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  loginUser,
  registerUser,
  SESSION_DURATION_MS,
} from "./auth.service.js";

export function createAuthRouter(database: DatabaseSync) {
  const router = Router();

  router.post("/register", async (request, response) => {
    const validation = registerSchema.safeParse(
      request.body
    );

    if (!validation.success) {
      response.status(400).json({
        error: "Dados de cadastro inválidos.",
      });
      return;
    }

    try {
      const user = await registerUser(
        database,
        validation.data
      );

      response.status(201).json({ user });
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        response.status(409).json({
          error: error.message,
        });
        return;
      }

      throw error;
    }
  });

  router.post("/login", async (request, response) => {
    const validation = loginSchema.safeParse(
      request.body
    );

    if (!validation.success) {
      response.status(400).json({
        error: "Dados de login inválidos.",
      });
      return;
    }

    try {
      const { user, sessionToken } = await loginUser(
        database,
        validation.data
      );

      response.cookie("icasei_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_DURATION_MS,
      });

      response.setHeader("Cache-Control", "no-store");

      response.status(200).json({ user });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        response.status(401).json({
          error: error.message,
        });
        return;
      }

      throw error;
    }
  });

  return router;
}
