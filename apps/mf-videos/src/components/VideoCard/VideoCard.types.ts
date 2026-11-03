import type { VideoItem } from "@icasei/contracts";

export type VideoPreview = Pick<VideoItem, "id" | "title" | "channelTitle" | "thumbnailUrl">;

export interface VideoCardProps<TVideo extends VideoPreview> {
  video: TVideo;
  onPlay: (video: TVideo) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (video: TVideo) => void;
  isFavoriteLoading?: boolean;
  isFavoriteDisabled?: boolean;
}
