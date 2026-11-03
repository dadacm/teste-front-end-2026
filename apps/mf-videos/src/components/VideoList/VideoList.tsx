import { VideoCard } from "../VideoCard/VideoCard";
import type { VideoListProps, VideoPreview } from "./VideoList.types";

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
