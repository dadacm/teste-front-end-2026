import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../../app.js";
import { openDatabase } from "../../database/connection.js";
import { runMigrations } from "../../database/migrate.js";

describe("GET /api/health", () => {
  it("deve retornar o status de saúde do BFF", async () => {
    const database = openDatabase(":memory:");

    try {
      runMigrations(database);

      const response = await request(createApp(database)).get("/api/health");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        status: "ok",
        service: "bff",
      });
    } finally {
      database.close();
    }
  });
});
