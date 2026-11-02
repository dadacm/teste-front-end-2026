import type { CreateFavoriteInput, FavoriteItem, FavoritesResponse } from "@icasei/contracts";

const STORAGE_KEY = "icasei_mock_favorites";

function readFavorites(): FavoriteItem[] {
  const storedFavorites = localStorage.getItem(STORAGE_KEY);

  if (!storedFavorites) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedFavorites);

    return Array.isArray(parsed) ? (parsed as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: FavoriteItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export async function listFavoritesMock(signal: AbortSignal): Promise<FavoritesResponse> {
  signal.throwIfAborted();

  const items = readFavorites();

  return {
    items,
    count: items.length,
  };
}

export async function addFavoriteMock(
  video: CreateFavoriteInput,
  signal: AbortSignal,
): Promise<FavoriteItem> {
  signal.throwIfAborted();

  const favorites = readFavorites();

  const existingFavorite = favorites.find((favorite) => favorite.id === video.id);

  if (existingFavorite) {
    return existingFavorite;
  }

  const favorite: FavoriteItem = {
    ...video,
    createdAt: new Date().toISOString(),
  };

  writeFavorites([favorite, ...favorites]);

  return favorite;
}

export async function removeFavoriteMock(videoId: string, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted();

  const favorites = readFavorites();

  writeFavorites(favorites.filter((favorite) => favorite.id !== videoId));
}
