import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";

import { getAuthenticatedUser } from "../auth/auth.service.js";

import { createFavoriteSchema, videoIdSchema } from "./favorites.schemas.js";

import { addUserFavorite, listUserFavorites, removeUserFavorite } from "./favorites.service.js";

export function createFavoritesRouter(database: DatabaseSync) {
  const router = Router();

  router.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-store");

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
  });

  router.get("/", (_request, response) => {
    const userId = response.locals.userId as string;

    const favorites = listUserFavorites(database, userId);

    response.status(200).json(favorites);
  });

  router.post("/", (request, response) => {
    const validation = createFavoriteSchema.safeParse(request.body);

    if (!validation.success) {
      response.status(400).json({
        error: "Dados do favorito inválidos.",
      });
      return;
    }

    const userId = response.locals.userId as string;

    const result = addUserFavorite(database, userId, validation.data);

    response.status(result.created ? 201 : 200).json({
      favorite: result.favorite,
    });
  });

  router.delete("/:videoId", (request, response) => {
    const validation = videoIdSchema.safeParse(request.params.videoId);

    if (!validation.success) {
      response.status(400).json({
        error: "Identificador do vídeo inválido.",
      });
      return;
    }

    const userId = response.locals.userId as string;

    removeUserFavorite(database, userId, validation.data);

    response.sendStatus(204);
  });

  return router;
}
