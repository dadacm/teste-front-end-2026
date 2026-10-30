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

interface AuthenticatedUser {
  id: string;
  email: string;
}

export function findUserByEmail(database: DatabaseSync, email: string): UserRecord | undefined {
  return database
    .prepare(
      `
      SELECT
        id,
        email,
        password_hash AS passwordHash
      FROM users
      WHERE email = ?
    `,
    )
    .get(email) as UserRecord | undefined;
}

export function insertUser(database: DatabaseSync, user: UserRecord): void {
  database
    .prepare(
      `
      INSERT INTO users (
        id,
        email,
        password_hash
      )
      VALUES (?, ?, ?)
    `,
    )
    .run(user.id, user.email, user.passwordHash);
}

export function insertSession(
  database: DatabaseSync,
  { tokenHash, userId, expiresAt }: CreateSessionData,
): void {
  database
    .prepare(
      `
        INSERT INTO sessions (
          token_hash,
          user_id,
          expires_at
        )
        VALUES (?, ?, ?)
      `,
    )
    .run(tokenHash, userId, expiresAt);
}

export function findUserByActiveSession(
  database: DatabaseSync,
  tokenHash: string,
  now: number,
): AuthenticatedUser | undefined {
  return database
    .prepare(
      `
        SELECT
          users.id,
          users.email
        FROM sessions
        INNER JOIN users
          ON users.id = sessions.user_id
        WHERE sessions.token_hash = ?
          AND sessions.expires_at > ?
        LIMIT 1
      `,
    )
    .get(tokenHash, now) as AuthenticatedUser | undefined;
}

export function deleteSession(database: DatabaseSync, tokenHash: string): void {
  database
    .prepare(
      `
        DELETE FROM sessions
        WHERE token_hash = ?
      `,
    )
    .run(tokenHash);
}
