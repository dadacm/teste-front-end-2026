import type { VideoItem } from "@icasei/contracts";

import { VideoCard } from "../VideoCard/VideoCard";

type VideoPreview = Pick<VideoItem, "id" | "title" | "channelTitle" | "thumbnailUrl">;

interface VideoListProps<TVideo extends VideoPreview> {
  videos: TVideo[];
  label: string;
  onPlay: (video: TVideo) => void;
  onToggleFavorite?: (video: TVideo) => void;
  isFavorite?: (video: TVideo) => boolean;
  favoriteLoadingId?: string | null;
  disableFavoriteActions?: boolean;
}

export function VideoList<TVideo extends VideoPreview>({
  videos,
  label,
  onPlay,
  onToggleFavorite,
  isFavorite,
  favoriteLoadingId,
  disableFavoriteActions = false,
}: VideoListProps<TVideo>) {
  return (
    <section aria-label={label} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite?.(video) ?? false}
          isFavoriteLoading={favoriteLoadingId === video.id}
          isFavoriteDisabled={disableFavoriteActions}
        />
      ))}
    </section>
  );
}
