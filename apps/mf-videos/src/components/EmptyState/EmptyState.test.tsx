import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("deve renderizar o título e a descrição", () => {
    render(
      <EmptyState
        icon={<span>Ícone</span>}
        title="Nenhum favorito"
        description="Você ainda não salvou nenhum vídeo."
      />,
    );

    expect(screen.getByRole("heading", { name: "Nenhum favorito" })).toBeDefined();

    expect(screen.getByText("Você ainda não salvou nenhum vídeo.")).toBeDefined();
  });

  it("deve renderizar o ícone recebido", () => {
    render(
      <EmptyState
        icon={<span data-testid="empty-icon">Ícone</span>}
        title="Nenhum resultado"
        description="Tente pesquisar novamente."
      />,
    );

    expect(screen.getByTestId("empty-icon")).toBeDefined();
  });

  it("deve renderizar e executar a ação recebida", () => {
    const handleClick = vi.fn();

    render(
      <EmptyState
        icon={<span>Ícone</span>}
        title="Nenhum favorito"
        description="Explore nossos vídeos."
        action={
          <button type="button" onClick={handleClick}>
            Explorar vídeos
          </button>
        }
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Explorar vídeos",
      }),
    );

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("não deve renderizar uma ação quando ela não for informada", () => {
    render(
      <EmptyState
        icon={<span>Ícone</span>}
        title="Nenhum resultado"
        description="Não encontramos vídeos."
      />,
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
