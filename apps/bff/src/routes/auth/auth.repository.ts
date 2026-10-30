
import type { DatabaseSync } from "node:sqlite";

interface CreateUserData {
  id: string;
  email: string;
  passwordHash: string;
}

export function findUserByEmail(
  database: DatabaseSync,
  email: string
): { id: string } | undefined {
  return database
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email) as { id: string } | undefined;
}

export function insertUser(
  database: DatabaseSync,
  { id, email, passwordHash }: CreateUserData
): void {
  database
    .prepare(`
      INSERT INTO users (id, email, password_hash)
      VALUES (?, ?, ?)
    `)
    .run(id, email, passwordHash);
}
