import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkSession, login, logout } from "./auth.api";

const fetchMock = vi.fn();

const mockResponse = (status: number) => {
  fetchMock.mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
  });
};

describe("auth.api", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("envia as credenciais e inclui os cookies no login", async () => {
    mockResponse(200);

    const signal = new AbortController().signal;

    await login(
      {
        email: "usuario@icasei.com",
        password: "senha123",
      },
      signal,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        signal,
        body: JSON.stringify({
          email: "usuario@icasei.com",
          password: "senha123",
        }),
      }),
    );
  });

  it("retorna erro quando as credenciais são inválidas", async () => {
    mockResponse(401);

    await expect(
      login({ email: "usuario@icasei.com", password: "incorreta" }, new AbortController().signal),
    ).rejects.toThrow("E-mail ou senha inválidos.");
  });

  it("identifica uma sessão autenticada", async () => {
    mockResponse(200);

    const result = await checkSession(new AbortController().signal);

    expect(result).toBe(true);
  });

  it("identifica uma sessão não autenticada", async () => {
    mockResponse(401);

    const result = await checkSession(new AbortController().signal);

    expect(result).toBe(false);
  });

  it("envia a requisição de logout com os cookies", async () => {
    mockResponse(200);

    const signal = new AbortController().signal;

    await logout(signal);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        signal,
      }),
    );
  });
});
