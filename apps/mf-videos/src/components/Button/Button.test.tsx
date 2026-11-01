import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

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
});
