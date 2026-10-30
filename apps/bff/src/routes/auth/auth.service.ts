
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import * as argon2 from "argon2";

import type { RegisterInput } from "./auth.schemas.js";

import {
  findUserByEmail,
  insertUser,
} from "./auth.repository.js";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("E-mail já cadastrado.");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export async function registerUser(
  database: DatabaseSync,
  { email, password }: RegisterInput
) {
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
