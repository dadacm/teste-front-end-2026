import type { DatabaseSync } from "node:sqlite";
import request from "supertest";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../../app.js";
import { openDatabase } from "../../database/connection.js";
import { runMigrations } from "../../database/migrate.js";

describe("POST /api/auth/register", () => {
  let database: DatabaseSync;

  const validUser = {
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

  it("deve cadastrar um usuário válido", async () => {
    const response = await request(createApp(database)).post("/api/auth/register").send(validUser);

    expect(response.status).toBe(201);

    expect(response.body.user).toEqual({
      id: expect.any(String),
      email: validUser.email,
    });

    expect(response.body.user).not.toHaveProperty("password");

    expect(response.body.user).not.toHaveProperty("passwordHash");
  });

  it("deve rejeitar um e-mail já cadastrado", async () => {
    const app = createApp(database);

    await request(app).post("/api/auth/register").send(validUser);

    const response = await request(app).post("/api/auth/register").send(validUser);

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      error: "E-mail já cadastrado.",
    });
  });

  it("deve rejeitar dados inválidos", async () => {
    const response = await request(createApp(database)).post("/api/auth/register").send({
      email: "email-invalido",
      password: "123",
    });

    expect(response.status).toBe(400);
  });
});
