import type { DatabaseSync } from "node:sqlite";
import request from "supertest";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../../app.js";
import { openDatabase } from "../../database/connection.js";
import { runMigrations } from "../../database/migrate.js";

describe("/api/favorites", () => {
  let database: DatabaseSync;
  let app: ReturnType<typeof createApp>;

  const video = {
    id: "video123abc",
    title: "Vídeo de teste",
    channelTitle: "Canal de teste",
    thumbnailUrl: "https://example.com/video.jpg",
  };

  beforeEach(() => {
    database = openDatabase(":memory:");
    runMigrations(database);

    app = createApp(database);
  });

  afterEach(() => {
    database.close();
  });

  async function createAuthenticatedAgent(email: string) {
    const agent = request.agent(app);

    const credentials = {
      email,
      password: "SenhaParaTestes123!",
    };

    await agent.post("/api/auth/register").send(credentials).expect(201);

    await agent.post("/api/auth/login").send(credentials).expect(200);

    return agent;
  }

  it("exige autenticação em todas as operações", async () => {
    await request(app).get("/api/favorites").expect(401);

    await request(app).post("/api/favorites").send(video).expect(401);

    await request(app).delete(`/api/favorites/${video.id}`).expect(401);
  });

  it("adiciona e lista um favorito", async () => {
    const agent = await createAuthenticatedAgent("usuario1@teste.com");

    const created = await agent.post("/api/favorites").send(video).expect(201);

    expect(created.body.favorite).toEqual({
      ...video,
      createdAt: expect.any(String),
    });

    const response = await agent.get("/api/favorites").expect(200);

    expect(response.body.count).toBe(1);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].id).toBe(video.id);
  });

  it("não duplica um vídeo favorito", async () => {
    const agent = await createAuthenticatedAgent("usuario2@teste.com");

    await agent.post("/api/favorites").send(video).expect(201);

    await agent.post("/api/favorites").send(video).expect(200);

    const response = await agent.get("/api/favorites").expect(200);

    expect(response.body.count).toBe(1);
  });

  it("remove um favorito", async () => {
    const agent = await createAuthenticatedAgent("usuario3@teste.com");

    await agent.post("/api/favorites").send(video).expect(201);

    await agent.delete(`/api/favorites/${video.id}`).expect(204);

    const response = await agent.get("/api/favorites").expect(200);

    expect(response.body).toEqual({
      items: [],
      count: 0,
    });
  });

  it("mantém favoritos isolados por usuário", async () => {
    const firstUser = await createAuthenticatedAgent("primeiro@teste.com");

    const secondUser = await createAuthenticatedAgent("segundo@teste.com");

    await firstUser.post("/api/favorites").send(video).expect(201);

    const secondUserFavorites = await secondUser.get("/api/favorites").expect(200);

    expect(secondUserFavorites.body.count).toBe(0);

    await secondUser.delete(`/api/favorites/${video.id}`).expect(204);

    const firstUserFavorites = await firstUser.get("/api/favorites").expect(200);

    expect(firstUserFavorites.body.count).toBe(1);
  });

  it("rejeita dados inválidos", async () => {
    const agent = await createAuthenticatedAgent("usuario4@teste.com");

    await agent
      .post("/api/favorites")
      .send({
        id: "",
        title: "",
      })
      .expect(400);
  });
});
