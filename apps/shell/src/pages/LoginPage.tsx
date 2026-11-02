import { useState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { useFetch } from "@icasei/hooks";

import { loginUser } from "../controllers/auth.controller";
import type { LoginCredentials } from "../services/auth.api";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/videos";

  const {
    error,
    isLoading,
    execute: executeLogin,
  } = useFetch<void, LoginCredentials>(loginUser, {
    onSuccess: () => {
      navigate(redirectTo, { replace: true });
    },
  });

  const handleLogin = () => {
    void executeLogin({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-text-primary">
      <section className="w-full max-w-md rounded-2xl border border-border-ui bg-surface p-6 shadow-xl sm:p-8">
        <header className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bem-vindo!</h1>

          <p className="text-sm text-text-secondary">
            Entre na sua conta para explorar e salvar seus vídeos favoritos.
          </p>
        </header>

        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-border-ui bg-background px-4 py-3 transition-colors outline-none placeholder:text-text-muted focus:border-brand"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-border-ui bg-background px-4 py-3 transition-colors outline-none placeholder:text-text-muted focus:border-brand"
            />
          </div>

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
            disabled={isLoading || !email.trim() || !password}
            aria-busy={isLoading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 font-semibold text-background transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <LogIn size={18} aria-hidden="true" />
            )}

            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
