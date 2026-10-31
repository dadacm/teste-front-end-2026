import type { DatabaseSync } from "node:sqlite";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createApp } from "../../app.js";
import { openDatabase } from "../../database/connection.js";
import { runMigrations } from "../../database/migrate.js";

describe("GET /api/videos/search", () => {
  let database: DatabaseSync;
  let app: ReturnType<typeof createApp>;

  const testUser = {
    email: "videos@teste.com",
    password: "SenhaParaTestes123!",
  };

  beforeEach(() => {
    database = openDatabase(":memory:");
    runMigrations(database);

    app = createApp(database);

    vi.stubEnv("YOUTUBE_API_KEY", "chave-de-teste");
  });

  afterEach(() => {
    database.close();

    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  async function createAuthenticatedAgent() {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send(testUser).expect(201);

    await agent.post("/api/auth/login").send(testUser).expect(200);

    return agent;
  }

  it("retorna 401 sem autenticação", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    const response = await request(app)
      .get("/api/videos/search")
      .query({ q: "icasei" })
      .expect(401);

    expect(response.body).toEqual({
      error: "Usuário não autenticado.",
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("retorna 400 para uma busca inválida", async () => {
    const agent = await createAuthenticatedAgent();

    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    const response = await agent.get("/api/videos/search").query({ q: " " }).expect(400);

    expect(response.body).toEqual({
      error: "Parâmetros de busca inválidos.",
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("retorna 503 sem a chave da API", async () => {
    const agent = await createAuthenticatedAgent();

    vi.stubEnv("YOUTUBE_API_KEY", "");

    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    const response = await agent.get("/api/videos/search").query({ q: "icasei" }).expect(503);

    expect(response.body).toEqual({
      error: "A integração com o YouTube não está configurada.",
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("retorna os vídeos encontrados", async () => {
    const agent = await createAuthenticatedAgent();

    const youtubeResponse = {
      nextPageToken: "pagina-2",
      items: [
        {
          id: {
            videoId: "video123abc",
          },
          snippet: {
            title: "Vídeo de teste",
            channelTitle: "Canal de teste",
            publishedAt: "2026-01-01T12:00:00Z",
            thumbnails: {
              high: {
                url: "https://example.com/thumbnail.jpg",
              },
            },
          },
        },
      ],
    };

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(youtubeResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await agent.get("/api/videos/search").query({ q: "icasei" }).expect(200);

    expect(response.body).toEqual({
      items: [
        {
          id: "video123abc",
          title: "Vídeo de teste",
          channelTitle: "Canal de teste",
          publishedAt: "2026-01-01T12:00:00Z",
          thumbnailUrl: "https://example.com/thumbnail.jpg",
        },
      ],
      nextPageToken: "pagina-2",
    });

    expect(fetchMock).toHaveBeenCalledOnce();

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));

    expect(url.searchParams.get("q")).toBe("icasei");
    expect(url.searchParams.get("type")).toBe("video");
    expect(url.searchParams.get("videoEmbeddable")).toBe("true");
  });

  it("envia o token de paginação", async () => {
    const agent = await createAuthenticatedAgent();

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ items: [] }), {
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await agent
      .get("/api/videos/search")
      .query({
        q: "icasei",
        pageToken: "pagina-2",
      })
      .expect(200);

    expect(fetchMock).toHaveBeenCalledOnce();

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));

    expect(url.searchParams.get("q")).toBe("icasei");
    expect(url.searchParams.get("pageToken")).toBe("pagina-2");
  });

  it("trata erros da API do YouTube", async () => {
    const agent = await createAuthenticatedAgent();

    vi.spyOn(console, "error").mockImplementation(() => {});

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(null, {
        status: 403,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await agent.get("/api/videos/search").query({ q: "icasei" }).expect(502);

    expect(response.body).toEqual({
      error: "Não foi possível buscar os vídeos.",
    });
  });

  it("trata falhas de conexão", async () => {
    const agent = await createAuthenticatedAgent();

    vi.spyOn(console, "error").mockImplementation(() => {});

    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("Falha de conexão"));

    vi.stubGlobal("fetch", fetchMock);

    const response = await agent.get("/api/videos/search").query({ q: "icasei" }).expect(502);

    expect(response.body).toEqual({
      error: "Não foi possível buscar os vídeos.",
    });
  });
});
