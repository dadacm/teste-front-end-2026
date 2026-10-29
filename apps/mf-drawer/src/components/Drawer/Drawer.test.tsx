
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("deve chamar onNavigate ao clicar em Favoritos", async () => {
    render(
      <Drawer
        currentPath="/videos"
        favoritesCount={3}
        onNavigate={vi.fn()}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Favoritos (3)",
      })
    ).toBeInTheDocument();
  });

  it("deve identificar a rota ativa", () => {
    render(
      <Drawer
        currentPath="/videos"
        favoritesCount={0}
        onNavigate={vi.fn()}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Vídeos",
      })
    ).toHaveAttribute("aria-current", "page");
  });

  it("deve chamar onNavigate ao clicar em Favoritos", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(
      <Drawer
        currentPath="/videos"
        favoritesCount={0}
        onNavigate={onNavigate}
      />
    );

    await user.click(
      screen.getByRole("link", {
        name: "Favoritos (0)",
      })
    );

    expect(onNavigate).toHaveBeenCalledWith(
      "/favorites"
    );
  });
});
