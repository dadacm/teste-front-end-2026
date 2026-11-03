import { useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { useFetch } from "@icasei/hooks";

import { Input } from "../components/Input/Input";
import { registerUser } from "../controllers/auth.controller";
import type { RegisterCredentials } from "../services/auth.api";

export function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    error,
    isLoading,
    execute: executeRegister,
  } = useFetch<void, RegisterCredentials>(registerUser, {
    onSuccess: () => {
      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("As senhas não coincidem.");
      return;
    }

    void executeRegister({
      email: email.trim(),
      password,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-text-primary">
      <section className="w-full max-w-md rounded-2xl border border-border-ui bg-surface p-6 shadow-xl sm:p-8">
        <header className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>

          <p className="text-sm text-text-secondary">
            Cadastre-se para pesquisar, assistir e salvar seus vídeos favoritos.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
            disabled={isLoading}
          />

          <div className="space-y-2">
            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Crie uma senha"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setValidationError(null);
              }}
              minLength={12}
              maxLength={128}
              required
              disabled={isLoading}
            />

            <p className="text-xs text-text-secondary">Utilize pelo menos 12 caracteres.</p>
          </div>

          <Input
            id="confirmPassword"
            label="Confirme sua senha"
            type="password"
            placeholder="Digite sua senha novamente"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setValidationError(null);
            }}
            error={validationError ?? undefined}
            minLength={12}
            maxLength={128}
            required
            disabled={isLoading}
          />

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 font-semibold text-background transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <UserPlus size={18} aria-hidden="true" />
            )}

            {isLoading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Já possui uma conta?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
