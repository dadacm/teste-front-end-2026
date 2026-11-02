import type { CreateFavoriteInput, FavoriteItem, FavoritesResponse } from "@icasei/contracts";

const BASE_URL = "/api/favorites";

function handleResponseError(response: Response): void {
  if (response.status === 401) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível realizar a operação com favoritos.");
  }
}

export async function fetchFavorites(...args: [void, AbortSignal]): Promise<FavoritesResponse> {
  const response = await fetch(BASE_URL, {
    method: "GET",
    credentials: "include",
    signal: args[1],
  });

  handleResponseError(response);

  return (await response.json()) as FavoritesResponse;
}

export async function saveFavorite(
  video: CreateFavoriteInput,
  signal: AbortSignal,
): Promise<FavoriteItem> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    credentials: "include",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(video),
  });

  handleResponseError(response);

  const result = (await response.json()) as {
    favorite: FavoriteItem;
  };

  return result.favorite;
}

export async function deleteFavorite(videoId: string, signal: AbortSignal): Promise<void> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(videoId)}`, {
    method: "DELETE",
    credentials: "include",
    signal,
  });

  handleResponseError(response);
}
