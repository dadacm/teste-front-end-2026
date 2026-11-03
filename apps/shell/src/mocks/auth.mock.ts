import type { LoginCredentials, RegisterCredentials } from "../services/auth.api";

const MOCK_SESSION_KEY = "icasei_mock_session";

export async function loginMock({ email, password }: LoginCredentials): Promise<void> {
  if (email !== "teste@exemplo.com" || password !== "senha123") {
    throw new Error("E-mail ou senha inválidos.");
  }

  sessionStorage.setItem(MOCK_SESSION_KEY, "true");
}

export async function checkSessionMock(): Promise<boolean> {
  return sessionStorage.getItem(MOCK_SESSION_KEY) === "true";
}

export async function logoutMock(): Promise<void> {
  sessionStorage.removeItem(MOCK_SESSION_KEY);
}

const mockUsers = new Map<string, string>([["teste@exemplo.com", "senha123"]]);

export async function registerMock({ email, password }: RegisterCredentials): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  if (mockUsers.has(normalizedEmail)) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  mockUsers.set(normalizedEmail, password);
}
