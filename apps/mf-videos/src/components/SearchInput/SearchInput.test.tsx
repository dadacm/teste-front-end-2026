import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("deve renderizar o formulário de busca", () => {
    render(<SearchInput onSearch={vi.fn()} />);

    expect(screen.getByRole("search")).toBeDefined();

    expect(
      screen.getByRole("searchbox", {
        name: "Pesquisar vídeos",
      }),
    ).toBeDefined();

    expect(
      screen.getByRole("button", {
        name: "Buscar",
      }),
    ).toBeDefined();
  });

  it("deve executar onSearch com o termo informado", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "React" },
    });

    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith("React");
  });

  it("deve remover espaços antes e depois da pesquisa", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "   TypeScript   " },
    });

    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).toHaveBeenCalledWith("TypeScript");
  });

  it("não deve pesquisar termos com menos de dois caracteres", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "a" },
    });

    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("não deve pesquisar quando o campo contém apenas espaços", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "    " },
    });

    const button = screen.getByRole("button", {
      name: "Buscar",
    });

    expect(button.hasAttribute("disabled")).toBe(true);

    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("deve bloquear novas buscas durante o carregamento", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} isLoading />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "React" },
    });

    const button = screen.getByRole("button", {
      name: "Buscando...",
    });

    expect(button.hasAttribute("disabled")).toBe(true);

    expect(button.getAttribute("aria-busy")).toBe("true");

    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("deve aplicar os atributos de validação do campo", () => {
    render(<SearchInput onSearch={vi.fn()} />);

    const input = screen.getByRole("searchbox");

    expect(input.getAttribute("minlength")).toBe("2");
    expect(input.getAttribute("maxlength")).toBe("100");
    expect(input.hasAttribute("required")).toBe(true);
  });
});
