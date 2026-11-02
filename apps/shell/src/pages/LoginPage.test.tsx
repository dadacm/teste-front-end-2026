import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import { LoginPage } from "./LoginPage";
import { loginUser } from "../controllers/auth.controller";

vi.mock("../controllers/auth.controller", () => ({
  loginUser: vi.fn(),
}));

const renderLoginPage = (from?: string) => {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/login",
          state: from ? { from } : null,
        },
      ]}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/videos" element={<p>Página de vídeos</p>} />
        <Route path="/favorites" element={<p>Página de favoritos</p>} />
      </Routes>
    </MemoryRouter>,
  );
};

const fillLoginForm = (email = "teste@icasei.com", password = "senha123") => {
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: email },
  });

  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: password },
  });

  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(loginUser).mockResolvedValue(undefined);
  });

  it("renderiza o formulário de login", () => {
    renderLoginPage();

    expect(screen.getByLabelText("E-mail")).toBeDefined();
    expect(screen.getByLabelText("Senha")).toBeDefined();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeDefined();
  });

  it("envia as credenciais e redireciona após o login", async () => {
    renderLoginPage();

    fillLoginForm(" usuario@icasei.com ", "senha123");

    expect(await screen.findByText("Página de vídeos")).toBeDefined();

    expect(loginUser).toHaveBeenCalledWith(
      {
        email: "usuario@icasei.com",
        password: "senha123",
      },
      expect.any(AbortSignal),
    );
  });

  it("exibe uma mensagem quando o login falha", async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error("E-mail ou senha inválidos."));

    renderLoginPage();
    fillLoginForm();

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain("E-mail ou senha inválidos.");
  });

  it("retorna para a rota solicitada após o login", async () => {
    renderLoginPage("/favorites");

    fillLoginForm();

    expect(await screen.findByText("Página de favoritos")).toBeDefined();
  });

  it("mantém o botão desabilitado com formulário vazio", () => {
    renderLoginPage();

    const button = screen.getByRole("button", {
      name: "Entrar",
    });

    expect(button.hasAttribute("disabled")).toBe(true);
  });
});
