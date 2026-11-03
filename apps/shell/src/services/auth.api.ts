export type LoginCredentials = {
  email: string;
  password: string;
};

export async function login(
  { email, password }: LoginCredentials,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 401) {
    throw new Error("E-mail ou senha inválidos.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível realizar o login.");
  }
}

export async function checkSession(signal: AbortSignal): Promise<boolean> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
    signal,
  });

  if (response.status === 401) return false;

  if (!response.ok) {
    throw new Error("Não foi possível verificar a sessão.");
  }

  return true;
}

export async function logout(signal: AbortSignal): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("Não foi possível encerrar a sessão.");
  }
}

export const verifySession = (...args: [void, AbortSignal]) => checkSession(args[1]);

export const endSession = (...args: [void, AbortSignal]) => logout(args[1]);

export type RegisterCredentials = {
  email: string;
  password: string;
};

export async function register(
  credentials: RegisterCredentials,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (response.status === 409) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  if (response.status === 400) {
    throw new Error("Confira o e-mail e os requisitos da senha.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível criar sua conta.");
  }
}
