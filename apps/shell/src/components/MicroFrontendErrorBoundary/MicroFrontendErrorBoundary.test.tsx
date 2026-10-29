
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MicroFrontendErrorBoundary } from "./MicroFrontendErrorBoundary";
import type { ReactElement } from "react";

function FailingComponent(): ReactElement {
    throw new Error("Erro simulado");
  }

describe("MicroFrontendErrorBoundary", () => {
  it("deve renderizar os filhos quando não houver erro", () => {
    render(
      <MicroFrontendErrorBoundary remoteName="Vídeos">
        <p>Micro-frontend carregado</p>
      </MicroFrontendErrorBoundary>
    );

    expect(
      screen.getByText("Micro-frontend carregado")
    ).toBeInTheDocument();
  });

  it("deve exibir o fallback quando um componente falhar", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      render(
        <MicroFrontendErrorBoundary remoteName="Vídeos">
          <FailingComponent />
        </MicroFrontendErrorBoundary>
      );

      expect(
        screen.getByRole("alert")
      ).toHaveTextContent(
        "Não foi possível carregar Vídeos"
      );

      expect(
        screen.getByRole("button", {
          name: "Recarregar página",
        })
      ).toBeInTheDocument();
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
