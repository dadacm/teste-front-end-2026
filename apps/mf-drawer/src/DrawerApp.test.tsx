
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DrawerApp from "./DrawerApp";

describe("DrawerApp", () => {
  it("deve encaminhar as props para o Drawer", () => {
    render(
      <DrawerApp
        currentPath="/favorites"
        favoritesCount={5}
        onNavigate={vi.fn()}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Favoritos (5)",
      })
    ).toHaveAttribute("aria-current", "page");
  });
});
