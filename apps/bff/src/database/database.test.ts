import { describe, expect, it } from "vitest";

import { openDatabase } from "./connection.js";
import { runMigrations } from "./migrate.js";

describe("Database", () => {
  it("deve criar as tabelas e registrar a migration", () => {
    const database = openDatabase(":memory:");

    try {
      runMigrations(database);
      runMigrations(database);

      const tables = database
        .prepare(
          `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `,
        )
        .all();

      expect(tables).toEqual([{ name: "favorites" }, { name: "sessions" }, { name: "users" }]);

      expect(database.prepare("PRAGMA user_version").get()).toEqual({ user_version: 1 });
    } finally {
      database.close();
    }
  });
});
