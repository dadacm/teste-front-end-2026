
import type { DatabaseSync } from "node:sqlite";

import { initialMigration } from "./migrations/001_initial.js";

export function runMigrations(database: DatabaseSync): void {
  database.exec("BEGIN IMMEDIATE;");

  try {
    const result = database
      .prepare("PRAGMA user_version")
      .get() as { user_version: number };

    if (result.user_version < 1) {
      database.exec(initialMigration);
      database.exec("PRAGMA user_version = 1;");
    }

    database.exec("COMMIT;");
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}
