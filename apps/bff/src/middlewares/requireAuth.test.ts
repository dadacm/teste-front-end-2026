import type { DatabaseSync } from "node:sqlite";
import request from "supertest";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../app.js";
import { openDatabase } from "../database/connection.js";
import { runMigrations } from "../database/migrate.js";

describe("requireAuth", () => {
  let database: DatabaseSync;
  let app: ReturnType<typeof createApp>;

  const testUser = {
    email: "middleware@teste.com",
    password: "SenhaSegura12345!",
  };

  beforeEach(() => {
    database = openDatabase(":memory:");
    runMigrations(database);

    app = createApp(database);
  });

  afterEach(() => {
    database.close();
  });

  async function createAuthenticatedAgent() {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send(testUser).expect(201);

    await agent.post("/api/auth/login").send(testUser).expect(200);

    return agent;
  }

  it("deve rejeitar requisições sem sessão", async () => {
    const response = await request(app).get("/api/favorites").expect(401);

    expect(response.body).toEqual({
      error: "Usuário não autenticado.",
    });
  });

  it("deve rejeitar tokens inválidos", async () => {
    const response = await request(app)
      .get("/api/favorites")
      .set("Cookie", "icasei_session=token-invalido")
      .expect(401);

    expect(response.body).toEqual({
      error: "Usuário não autenticado.",
    });
  });

  it("deve permitir acesso com sessão válida", async () => {
    const agent = await createAuthenticatedAgent();

    await agent.get("/api/favorites").expect(200);
  });

  it("deve rejeitar sessões expiradas", async () => {
    const agent = await createAuthenticatedAgent();

    database.prepare("UPDATE sessions SET expires_at = ?").run(Date.now() - 1000);

    const response = await agent.get("/api/favorites").expect(401);

    expect(response.body).toEqual({
      error: "Usuário não autenticado.",
    });
  });

  it("deve proteger também as rotas de vídeos", async () => {
    const response = await request(app).get("/api/videos/search").query({ q: "react" }).expect(401);

    expect(response.body).toEqual({
      error: "Usuário não autenticado.",
    });
  });
});
