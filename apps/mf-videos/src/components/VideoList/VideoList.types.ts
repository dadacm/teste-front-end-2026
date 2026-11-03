import type { VideoItem } from "@icasei/contracts";

export type VideoPreview = Pick<VideoItem, "id" | "title" | "channelTitle" | "thumbnailUrl">;

export interface VideoListProps<TVideo extends VideoPreview> {
  videos: TVideo[];
  label: string;
  onPlay: (video: TVideo) => void;
  onToggleFavorite?: (video: TVideo) => void;
  isFavorite?: (video: TVideo) => boolean;
  favoriteLoadingId?: string | null;
  disableFavoriteActions?: boolean;
}
