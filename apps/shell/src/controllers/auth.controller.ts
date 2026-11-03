import type { LoginCredentials, RegisterCredentials } from "../services/auth.api";

import { login, checkSession, logout, register } from "../services/auth.api";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export async function loginUser(credentials: LoginCredentials, signal: AbortSignal): Promise<void> {
  if (useMocks) {
    const { loginMock } = await import("../mocks/auth.mock");

    return loginMock(credentials);
  }

  return login(credentials, signal);
}

export async function verifySession(...args: [void, AbortSignal]): Promise<boolean> {
  if (useMocks) {
    const { checkSessionMock } = await import("../mocks/auth.mock");

    return checkSessionMock();
  }

  return checkSession(args[1]);
}

export async function endSession(...args: [void, AbortSignal]): Promise<void> {
  if (useMocks) {
    const { logoutMock } = await import("../mocks/auth.mock");

    return logoutMock();
  }

  return logout(args[1]);
}

export async function registerUser(
  credentials: RegisterCredentials,
  signal: AbortSignal,
): Promise<void> {
  if (useMocks) {
    const { registerMock } = await import("../mocks/auth.mock");

    return registerMock(credentials);
  }

  return register(credentials, signal);
}
