import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { Heart } from "lucide-react";

describe("Button", () => {
  it("renderiza o conteúdo recebido", () => {
    render(<Button>Buscar</Button>);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeDefined();
  });

  it("executa o evento de clique", () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Buscar</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("desabilita o botão durante o carregamento", () => {
    render(<Button isLoading>Buscando...</Button>);

    const button = screen.getByRole("button");

    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("utiliza button como tipo padrão", () => {
    render(<Button>Fechar</Button>);

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("renderiza apenas o ícone na variante icon-only", () => {
    render(
      <Button
        variant="icon-only"
        icon={<Heart data-testid="heart-icon" />}
        aria-label="Adicionar aos favoritos"
      />,
    );

    const button = screen.getByRole("button", {
      name: "Adicionar aos favoritos",
    });

    expect(screen.getByTestId("heart-icon")).toBeDefined();
    expect(button.textContent).toBe("");
  });

  it("substitui o ícone pelo spinner durante o carregamento", () => {
    render(
      <Button
        variant="icon-only"
        icon={<Heart data-testid="heart-icon" />}
        aria-label="Adicionar aos favoritos"
        isLoading
      />,
    );

    const button = screen.getByRole("button", {
      name: "Adicionar aos favoritos",
    });

    expect(screen.queryByTestId("heart-icon")).toBeNull();
    expect(button.querySelector("svg")).not.toBeNull();
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });
});
