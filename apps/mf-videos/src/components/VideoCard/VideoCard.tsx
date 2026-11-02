import type { VideoItem } from "@icasei/contracts";
import { LoaderCircle, Play, Star } from "lucide-react";

type VideoPreview = Pick<VideoItem, "id" | "title" | "channelTitle" | "thumbnailUrl">;

interface VideoCardProps<TVideo extends VideoPreview> {
  video: TVideo;
  onPlay: (video: TVideo) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (video: TVideo) => void;
  isFavoriteLoading?: boolean;
  isFavoriteDisabled?: boolean;
}

export function VideoCard<TVideo extends VideoPreview>({
  video,
  onPlay,
  isFavorite = false,
  onToggleFavorite,
  isFavoriteLoading = false,
  isFavoriteDisabled = false,
}: VideoCardProps<TVideo>) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-border-ui bg-surface transition-colors hover:border-brand/60">
      <div className="relative aspect-video overflow-hidden bg-sidebar">
        <img
          src={video.thumbnailUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={() => onPlay(video)}
          aria-label={`Reproduzir ${video.title}`}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/15 transition-colors hover:bg-black/35 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-brand text-background shadow-lg">
            <Play size={22} fill="currentColor" aria-hidden="true" />
          </span>
        </button>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(video)}
            disabled={isFavoriteDisabled || isFavoriteLoading}
            aria-label={
              isFavorite
                ? `Remover ${video.title} dos favoritos`
                : `Adicionar ${video.title} aos favoritos`
            }
            aria-pressed={isFavorite}
            aria-busy={isFavoriteLoading}
            className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-background/90 text-text-primary shadow-lg transition-colors hover:bg-brand hover:text-background focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFavoriteLoading ? (
              <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
            ) : (
              <Star size={19} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold text-text-primary">{video.title}</h3>

        <p className="text-sm text-text-secondary">{video.channelTitle}</p>
      </div>
    </article>
  );
}
