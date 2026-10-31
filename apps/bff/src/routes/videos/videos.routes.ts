import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";

import { getAuthenticatedUser } from "../auth/auth.service.js";
import { searchVideosSchema } from "./videos.schemas.js";
import { searchYouTubeVideos } from "./videos.service.js";

export function createVideosRouter(database: DatabaseSync) {
  const router = Router();

  router.get("/search", async (request, response) => {
    response.setHeader("Cache-Control", "no-store");

    const sessionToken = request.cookies?.icasei_session;

    const user =
      typeof sessionToken === "string" ? getAuthenticatedUser(database, sessionToken) : null;

    if (!user) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    const validation = searchVideosSchema.safeParse(request.query);

    if (!validation.success) {
      return response.status(400).json({
        error: "Parâmetros de busca inválidos.",
      });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return response.status(503).json({
        error: "A integração com o YouTube não está configurada.",
      });
    }

    try {
      const result = await searchYouTubeVideos({
        query: validation.data.q,
        apiKey,
        ...(validation.data.pageToken && {
          pageToken: validation.data.pageToken,
        }),
      });

      return response.status(200).json(result);
    } catch (error) {
      console.error("Erro ao consultar YouTube:", error instanceof Error ? error.message : error);

      return response.status(502).json({
        error: "Não foi possível buscar os vídeos.",
      });
    }
  });

  return router;
}
