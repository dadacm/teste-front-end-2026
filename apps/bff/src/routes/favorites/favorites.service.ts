import type { DatabaseSync } from "node:sqlite";
import type { CreateFavoriteInput, FavoritesResponse } from "@icasei/contracts";

import {
  deleteFavorite,
  findFavoriteById,
  findFavoritesByUser,
  insertFavorite,
} from "./favorites.repository.js";

export function listUserFavorites(database: DatabaseSync, userId: string): FavoritesResponse {
  const items = findFavoritesByUser(database, userId);

  return {
    items,
    count: items.length,
  };
}

export function addUserFavorite(
  database: DatabaseSync,
  userId: string,
  video: CreateFavoriteInput,
) {
  const created = insertFavorite(database, userId, video);

  const favorite = findFavoriteById(database, userId, video.id);

  if (!favorite) {
    throw new Error("Não foi possível recuperar o favorito salvo.");
  }

  return {
    favorite,
    created,
  };
}

export function removeUserFavorite(database: DatabaseSync, userId: string, videoId: string): void {
  deleteFavorite(database, userId, videoId);
}
