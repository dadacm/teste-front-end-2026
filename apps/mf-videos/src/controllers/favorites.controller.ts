import type { CreateFavoriteInput, FavoriteItem, FavoritesResponse } from "@icasei/contracts";

import { fetchFavorites, saveFavorite, deleteFavorite } from "../services/favorites.api";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export async function getFavorites(...args: [void, AbortSignal]): Promise<FavoritesResponse> {
  if (useMocks) {
    const { listFavoritesMock } = await import("../mocks/favorites.mock");

    return listFavoritesMock(args[1]);
  }

  return fetchFavorites(...args);
}

export async function addFavorite(
  video: CreateFavoriteInput,
  signal: AbortSignal,
): Promise<FavoriteItem> {
  if (useMocks) {
    const { addFavoriteMock } = await import("../mocks/favorites.mock");

    return addFavoriteMock(video, signal);
  }

  return saveFavorite(video, signal);
}

export async function removeFavorite(videoId: string, signal: AbortSignal): Promise<void> {
  if (useMocks) {
    const { removeFavoriteMock } = await import("../mocks/favorites.mock");

    return removeFavoriteMock(videoId, signal);
  }

  return deleteFavorite(videoId, signal);
}
