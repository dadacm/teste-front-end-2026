import type { VideoItem } from "./videos.ts";

export type CreateFavoriteInput = Pick<VideoItem, "id" | "title" | "channelTitle" | "thumbnailUrl">;

export interface FavoriteItem extends CreateFavoriteInput {
  createdAt: string;
}

export interface FavoritesResponse {
  items: FavoriteItem[];
  count: number;
}

export const FAVORITES_UPDATED_EVENT = "icasei:favorites-updated";

export interface FavoritesUpdatedDetail {
  count: number;
}
