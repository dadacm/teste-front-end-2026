
import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";

import { registerSchema } from "./auth.schemas.js";

import {
  EmailAlreadyRegisteredError,
  registerUser,
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

  return router;
}
