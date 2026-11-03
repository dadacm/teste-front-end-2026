import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { createFavoriteSchema, videoIdSchema } from "./favorites.schemas.js";
import { addUserFavorite, listUserFavorites, removeUserFavorite } from "./favorites.service.js";

export function createFavoritesRouter(database: DatabaseSync) {
  const router = Router();

  router.use((_request, response, next) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  });

  router.use(requireAuth(database));

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
