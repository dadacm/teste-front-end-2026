import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Input } from "./Input";

describe("Input", () => {
  it("deve renderizar o label e o input corretamente", () => {
    render(<Input id="email" label="E-mail" type="email" placeholder="seu@email.com" />);

    const input = screen.getByLabelText("E-mail");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "seu@email.com");
  });

  it("deve executar onChange quando o valor for alterado", () => {
    const onChange = vi.fn();

    render(<Input id="email" label="E-mail" value="" onChange={onChange} />);

    const input = screen.getByLabelText("E-mail");

    fireEvent.change(input, {
      target: { value: "teste@icasei.com" },
    });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "change",
      }),
    );
  });

  it("deve receber e exibir o valor informado", () => {
    const { rerender } = render(
      <Input id="email" label="E-mail" value="primeiro@teste.com" onChange={vi.fn()} />,
    );

    expect(screen.getByLabelText("E-mail")).toHaveValue("primeiro@teste.com");

    rerender(<Input id="email" label="E-mail" value="segundo@teste.com" onChange={vi.fn()} />);

    expect(screen.getByLabelText("E-mail")).toHaveValue("segundo@teste.com");
  });

  it("deve respeitar as propriedades nativas do input", () => {
    render(
      <Input
        id="password"
        label="Senha"
        type="password"
        autoComplete="new-password"
        minLength={12}
        maxLength={128}
        required
      />,
    );

    const input = screen.getByLabelText("Senha");

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "new-password");
    expect(input).toHaveAttribute("minlength", "12");
    expect(input).toHaveAttribute("maxlength", "128");
    expect(input).toBeRequired();
  });

  it("deve exibir uma mensagem de erro acessível", () => {
    render(
      <Input
        id="confirmPassword"
        label="Confirme sua senha"
        type="password"
        error="As senhas não coincidem."
      />,
    );

    const input = screen.getByLabelText("Confirme sua senha");

    const errorMessage = screen.getByText("As senhas não coincidem.");

    expect(errorMessage).toBeInTheDocument();

    expect(input).toHaveAttribute("aria-invalid", "true");

    expect(input).toHaveAttribute("aria-describedby", "confirmPassword-error");

    expect(errorMessage).toHaveAttribute("id", "confirmPassword-error");
  });

  it("não deve exibir erro quando a propriedade não for informada", () => {
    render(<Input id="email" label="E-mail" type="email" />);

    const input = screen.getByLabelText("E-mail");

    expect(input).toHaveAttribute("aria-invalid", "false");

    expect(input).not.toHaveAttribute("aria-describedby");

    expect(document.getElementById("email-error")).toBeNull();
  });

  it("deve respeitar a propriedade disabled", () => {
    const onChange = vi.fn();

    render(<Input id="email" label="E-mail" disabled onChange={onChange} />);

    const input = screen.getByLabelText("E-mail");

    expect(input).toBeDisabled();
  });

  it("deve permitir adicionar classes CSS personalizadas", () => {
    render(<Input id="email" label="E-mail" className="custom-input-class" />);

    const input = screen.getByLabelText("E-mail");

    expect(input).toHaveClass("custom-input-class");
    expect(input).toHaveClass("rounded-lg");
  });
});
