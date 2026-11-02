import type { DatabaseSync } from "node:sqlite";
import type { CreateFavoriteInput, FavoriteItem } from "@icasei/contracts";

export function findFavoritesByUser(database: DatabaseSync, userId: string): FavoriteItem[] {
  return database
    .prepare(
      `
        SELECT
          video_id AS id,
          title,
          channel_title AS channelTitle,
          thumbnail_url AS thumbnailUrl,
          created_at AS createdAt
        FROM favorites
        WHERE user_id = ?
        ORDER BY created_at DESC, video_id DESC
      `,
    )
    .all(userId) as unknown as FavoriteItem[];
}

export function findFavoriteById(
  database: DatabaseSync,
  userId: string,
  videoId: string,
): FavoriteItem | undefined {
  return database
    .prepare(
      `
        SELECT
          video_id AS id,
          title,
          channel_title AS channelTitle,
          thumbnail_url AS thumbnailUrl,
          created_at AS createdAt
        FROM favorites
        WHERE user_id = ?
          AND video_id = ?
        LIMIT 1
      `,
    )
    .get(userId, videoId) as FavoriteItem | undefined;
}

export function insertFavorite(
  database: DatabaseSync,
  userId: string,
  video: CreateFavoriteInput,
): boolean {
  const result = database
    .prepare(
      `
        INSERT OR IGNORE INTO favorites (
          user_id,
          video_id,
          title,
          thumbnail_url,
          channel_title
        )
        VALUES (?, ?, ?, ?, ?)
      `,
    )
    .run(userId, video.id, video.title, video.thumbnailUrl, video.channelTitle);

  return result.changes > 0;
}

export function deleteFavorite(database: DatabaseSync, userId: string, videoId: string): boolean {
  const result = database
    .prepare(
      `
        DELETE FROM favorites
        WHERE user_id = ?
          AND video_id = ?
      `,
    )
    .run(userId, videoId);

  return result.changes > 0;
}
