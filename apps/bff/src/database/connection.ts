
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export function openDatabase(
  path = process.env.DATABASE_PATH ?? "./data/icasei.sqlite",
): DatabaseSync {
  const databasePath =
    path === ":memory:" ? path : resolve(path);

  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const database = new DatabaseSync(databasePath);

  database.exec("PRAGMA foreign_keys = ON;");

  if (databasePath !== ":memory:") {
    database.exec("PRAGMA journal_mode = WAL;");
  }

  return database;
}
