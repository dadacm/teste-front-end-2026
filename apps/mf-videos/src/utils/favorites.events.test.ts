import { describe, expect, it, vi } from "vitest";

import { FAVORITES_UPDATED_EVENT } from "@icasei/contracts";

import { notifyFavoritesUpdated } from "./favorites.events";

describe("favorites.events", () => {
  it("deve publicar a quantidade de favoritos", () => {
    const listener = vi.fn();

    window.addEventListener(FAVORITES_UPDATED_EVENT, listener);

    try {
      notifyFavoritesUpdated(3);

      expect(listener).toHaveBeenCalledOnce();

      const event = listener.mock.calls[0][0] as CustomEvent<{
        count: number;
      }>;

      expect(event.detail).toEqual({
        count: 3,
      });
    } finally {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, listener);
    }
  });
});
