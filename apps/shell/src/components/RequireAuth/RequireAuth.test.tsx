import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import { RequireAuth } from "./RequireAuth";
import { verifySession } from "../../controllers/auth.controller";

vi.mock("../../controllers/auth.controller", () => ({
  verifySession: vi.fn(),
}));

const renderProtectedRoute = () => {
  return render(
    <MemoryRouter initialEntries={["/videos"]}>
      <Routes>
        <Route path="/login" element={<p>Página de login</p>} />

        <Route element={<RequireAuth />}>
          <Route path="/videos" element={<p>Conteúdo protegido</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe("RequireAuth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("permite acessar a rota quando a sessão é válida", async () => {
    vi.mocked(verifySession).mockResolvedValue(true);

    renderProtectedRoute();

    expect(await screen.findByText("Conteúdo protegido")).toBeDefined();

    expect(verifySession).toHaveBeenCalledWith(undefined, expect.any(AbortSignal));
  });

  it("redireciona para o login quando não há sessão", async () => {
    vi.mocked(verifySession).mockResolvedValue(false);

    renderProtectedRoute();

    expect(await screen.findByText("Página de login")).toBeDefined();
  });

  it("exibe um erro quando não consegue verificar a sessão", async () => {
    vi.mocked(verifySession).mockRejectedValue(new Error("Falha ao verificar sessão."));

    renderProtectedRoute();

    const alert = await screen.findByRole("alert");

    expect(alert).toBeDefined();
    expect(screen.queryByText("Conteúdo protegido")).toBeNull();
  });
});
