import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";

import { RegisterPage } from "./RegisterPage";
import { registerUser } from "../controllers/auth.controller";

vi.mock("../controllers/auth.controller", () => ({
  registerUser: vi.fn(),
}));

const registerUserMock = vi.mocked(registerUser);

const validPassword = "SenhaSegura123!";

function LoginPageMock() {
  const location = useLocation();

  return (
    <div>
      <h1>Página de login</h1>

      {location.state?.registered && <p>Cadastro realizado com sucesso.</p>}
    </div>
  );
}

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPageMock />} />
      </Routes>
    </MemoryRouter>,
  );
}

function fillForm({
  email = "teste@icasei.com",
  password = validPassword,
  confirmPassword = validPassword,
} = {}) {
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: email },
  });

  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: password },
  });

  fireEvent.change(screen.getByLabelText("Confirme sua senha"), {
    target: { value: confirmPassword },
  });
}

function submitForm() {
  fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    registerUserMock.mockResolvedValue(undefined);
  });

  it("deve renderizar os campos e o botão de cadastro", () => {
    renderRegisterPage();

    expect(
      screen.getByRole("heading", {
        name: "Crie sua conta",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();

    expect(screen.getByLabelText("Senha")).toBeInTheDocument();

    expect(screen.getByLabelText("Confirme sua senha")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute("href", "/login");
  });

  it("deve aplicar os requisitos de validação aos campos", () => {
    renderRegisterPage();

    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");

    expect(screen.getByLabelText("E-mail")).toBeRequired();

    expect(screen.getByLabelText("Senha")).toHaveAttribute("minlength", "12");

    expect(screen.getByLabelText("Senha")).toHaveAttribute("maxlength", "128");

    expect(screen.getByLabelText("Confirme sua senha")).toBeRequired();
  });

  it("não deve cadastrar quando as senhas não coincidem", () => {
    renderRegisterPage();

    fillForm({
      password: validPassword,
      confirmPassword: "SenhaDiferente123!",
    });

    submitForm();

    expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();

    expect(registerUserMock).not.toHaveBeenCalled();
  });

  it("deve limpar o erro de confirmação ao alterar a senha", () => {
    renderRegisterPage();

    fillForm({
      confirmPassword: "SenhaDiferente123!",
    });

    submitForm();

    expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Confirme sua senha"), {
      target: { value: validPassword },
    });

    expect(screen.queryByText("As senhas não coincidem.")).not.toBeInTheDocument();
  });

  it("deve enviar os dados corretamente ao controller", async () => {
    renderRegisterPage();

    fillForm({
      email: "  teste@icasei.com  ",
    });

    submitForm();

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledOnce();
    });

    expect(registerUserMock).toHaveBeenCalledWith(
      {
        email: "teste@icasei.com",
        password: validPassword,
      },
      expect.any(AbortSignal),
    );
  });

  it("deve redirecionar para o login após o cadastro", async () => {
    renderRegisterPage();

    fillForm();
    submitForm();

    expect(
      await screen.findByRole("heading", {
        name: "Página de login",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Cadastro realizado com sucesso.")).toBeInTheDocument();

    expect(registerUserMock).toHaveBeenCalledOnce();
  });

  it("deve exibir erro quando o e-mail já estiver cadastrado", async () => {
    registerUserMock.mockRejectedValueOnce(new Error("Este e-mail já está cadastrado."));

    renderRegisterPage();

    fillForm();
    submitForm();

    expect(await screen.findByRole("alert")).toHaveTextContent("Este e-mail já está cadastrado.");

    expect(
      screen.getByRole("heading", {
        name: "Crie sua conta",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Página de login",
      }),
    ).not.toBeInTheDocument();
  });

  it("deve exibir erro quando o cadastro falhar", async () => {
    registerUserMock.mockRejectedValueOnce(new Error("Não foi possível criar sua conta."));

    renderRegisterPage();

    fillForm();
    submitForm();

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível criar sua conta.");
  });

  it("deve desabilitar o formulário durante o cadastro", async () => {
    registerUserMock.mockImplementationOnce(() => new Promise<void>(() => {}));

    renderRegisterPage();

    fillForm();
    submitForm();

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledOnce();
    });

    expect(
      screen.getByRole("button", {
        name: "Criando conta...",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Criando conta...",
      }),
    ).toHaveAttribute("aria-busy", "true");

    expect(screen.getByLabelText("E-mail")).toBeDisabled();
    expect(screen.getByLabelText("Senha")).toBeDisabled();

    expect(screen.getByLabelText("Confirme sua senha")).toBeDisabled();
  });

  it("deve permitir retornar ao login pelo link", () => {
    renderRegisterPage();

    fireEvent.click(
      screen.getByRole("link", {
        name: "Entrar",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Página de login",
      }),
    ).toBeInTheDocument();

    expect(registerUserMock).not.toHaveBeenCalled();
  });
});
