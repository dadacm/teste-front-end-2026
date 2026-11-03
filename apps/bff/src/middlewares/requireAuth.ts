import type { RequestHandler } from "express";
import type { DatabaseSync } from "node:sqlite";

import { getAuthenticatedUser } from "../routes/auth/auth.service.js";

export function requireAuth(database: DatabaseSync): RequestHandler {
  return (request, response, next) => {
    const sessionToken = request.cookies?.icasei_session;

    const user =
      typeof sessionToken === "string" ? getAuthenticatedUser(database, sessionToken) : null;

    if (!user) {
      response.status(401).json({
        error: "Usuário não autenticado.",
      });

      return;
    }

    response.locals.userId = user.id;

    next();
  };
}
