import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { searchVideosSchema } from "./videos.schemas.js";
import { searchYouTubeVideos } from "./videos.service.js";

export function createVideosRouter(database: DatabaseSync) {
  const router = Router();

  router.use((_request, response, next) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  });

  router.use(requireAuth(database));

  router.get("/search", async (request, response) => {
    const validation = searchVideosSchema.safeParse(request.query);

    if (!validation.success) {
      response.status(400).json({
        error: "Parâmetros de busca inválidos.",
      });
      return;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      response.status(503).json({
        error: "A integração com o YouTube não está configurada.",
      });
      return;
    }

    try {
      const result = await searchYouTubeVideos({
        query: validation.data.q,
        apiKey,
        ...(validation.data.pageToken && {
          pageToken: validation.data.pageToken,
        }),
      });

      response.status(200).json(result);
    } catch (error) {
      console.error("Erro ao consultar YouTube:", error instanceof Error ? error.message : error);

      response.status(502).json({
        error: "Não foi possível buscar os vídeos.",
      });
    }
  });

  return router;
}
