import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import * as argon2 from "argon2";
import type { RegisterInput } from "./auth.schemas.js";
import { createHash, randomBytes } from "node:crypto";
import type { LoginInput } from "./auth.schemas.js";
import {
  findUserByEmail,
  insertSession,
  insertUser,
  deleteSession,
  findUserByActiveSession,
} from "./auth.repository.js";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("E-mail já cadastrado.");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export async function registerUser(database: DatabaseSync, { email, password }: RegisterInput) {
  const existingUser = findUserByEmail(database, email);

  if (existingUser) {
    throw new EmailAlreadyRegisteredError();
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  const user = {
    id: randomUUID(),
    email,
  };

  try {
    insertUser(database, {
      ...user,
      passwordHash,
    });
  } catch (error) {
    if (findUserByEmail(database, email)) {
      throw new EmailAlreadyRegisteredError();
    }

    throw error;
  }

  return user;
}

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export class InvalidCredentialsError extends Error {
  constructor() {
    super("E-mail ou senha inválidos.");
    this.name = "InvalidCredentialsError";
  }
}

export async function loginUser(database: DatabaseSync, { email, password }: LoginInput) {
  const user = findUserByEmail(database, email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordMatches = await argon2.verify(user.passwordHash, password);

  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const sessionToken = randomBytes(32).toString("hex");

  const tokenHash = hashSessionToken(sessionToken);

  insertSession(database, {
    tokenHash,
    userId: user.id,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    sessionToken,
  };
}

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getAuthenticatedUser(database: DatabaseSync, sessionToken: string) {
  if (!/^[a-f0-9]{64}$/.test(sessionToken)) {
    return null;
  }

  const tokenHash = hashSessionToken(sessionToken);

  return findUserByActiveSession(database, tokenHash, Date.now()) ?? null;
}

export function logoutUser(database: DatabaseSync, sessionToken: string): void {
  if (!/^[a-f0-9]{64}$/.test(sessionToken)) {
    return;
  }

  const tokenHash = hashSessionToken(sessionToken);

  deleteSession(database, tokenHash);
}
