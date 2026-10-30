import type { DatabaseSync } from "node:sqlite";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../../app.js";
import { openDatabase } from "../../database/connection.js";
import { runMigrations } from "../../database/migrate.js";

describe("Sessões de autenticação", () => {
  let database: DatabaseSync;

  const user = {
    email: "teste@exemplo.com",
    password: "SenhaSegura12345!",
  };

  beforeEach(() => {
    database = openDatabase(":memory:");
    runMigrations(database);
  });

  afterEach(() => {
    database.close();
  });

  it("deve recuperar o usuário autenticado", async () => {
    const agent = request.agent(createApp(database));

    await agent.post("/api/auth/register").send(user).expect(201);

    await agent.post("/api/auth/login").send(user).expect(200);

    const response = await agent.get("/api/auth/me").expect(200);

    expect(response.body.user).toEqual({
      id: expect.any(String),
      email: user.email,
    });
  });

  it("deve rejeitar acesso sem sessão", async () => {
    const response = await request(createApp(database)).get("/api/auth/me").expect(401);

    expect(response.body).toHaveProperty("error");
  });

  it("deve rejeitar uma sessão expirada", async () => {
    const agent = request.agent(createApp(database));

    await agent.post("/api/auth/register").send(user).expect(201);

    await agent.post("/api/auth/login").send(user).expect(200);

    database
      .prepare(
        `
        UPDATE sessions
        SET expires_at = ?
      `,
      )
      .run(Date.now() - 1000);

    await agent.get("/api/auth/me").expect(401);
  });

  it("deve invalidar a sessão ao realizar logout", async () => {
    const agent = request.agent(createApp(database));

    await agent.post("/api/auth/register").send(user).expect(201);

    await agent.post("/api/auth/login").send(user).expect(200);

    await agent.get("/api/auth/me").expect(200);

    await agent.post("/api/auth/logout").expect(204);

    const sessions = database
      .prepare(
        `
        SELECT COUNT(*) AS total
        FROM sessions
      `,
      )
      .get() as { total: number };

    expect(sessions.total).toBe(0);

    await agent.get("/api/auth/me").expect(401);
  });
});
