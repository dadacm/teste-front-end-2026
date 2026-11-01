import type { VideoItem } from "@icasei/contracts";
import { Play } from "lucide-react";

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
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
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold text-text-primary">{video.title}</h3>

        <p className="text-sm text-text-secondary">{video.channelTitle}</p>
      </div>
    </article>
  );
}
