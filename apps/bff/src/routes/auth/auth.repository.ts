
import type { DatabaseSync } from "node:sqlite";

interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
}
interface CreateSessionData {
    tokenHash: string;
    userId: string;
    expiresAt: number;
  }

export function findUserByEmail(
  database: DatabaseSync,
  email: string
): UserRecord | undefined {
  return database
    .prepare(`
      SELECT
        id,
        email,
        password_hash AS passwordHash
      FROM users
      WHERE email = ?
    `)
    .get(email) as UserRecord | undefined;
}

export function insertUser(
  database: DatabaseSync,
  user: UserRecord
): void {
  database
    .prepare(`
      INSERT INTO users (
        id,
        email,
        password_hash
      )
      VALUES (?, ?, ?)
    `)
    .run(
      user.id,
      user.email,
      user.passwordHash
    );
}



export function insertSession(
    database: DatabaseSync,
    { tokenHash, userId, expiresAt }: CreateSessionData
  ): void {
    database
      .prepare(`
        INSERT INTO sessions (
          token_hash,
          user_id,
          expires_at
        )
        VALUES (?, ?, ?)
      `)
      .run(tokenHash, userId, expiresAt);
  }