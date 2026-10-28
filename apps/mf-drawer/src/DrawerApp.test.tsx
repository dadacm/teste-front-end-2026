
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DrawerApp from "./DrawerApp";

describe("DrawerApp", () => {
  it("deve exibir o contador de favoritos", () => {
    render(
      <DrawerApp
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
      <DrawerApp
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

  it("deve comunicar a navegação ao Shell", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(
      <DrawerApp
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
