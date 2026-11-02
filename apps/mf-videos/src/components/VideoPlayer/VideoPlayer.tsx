import type { VideoItem } from "@icasei/contracts";
import { X } from "lucide-react";

interface VideoPlayerProps {
  video: Pick<VideoItem, "id" | "title" | "channelTitle">;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  return (
    <section
      aria-label="Reprodutor de vídeo"
      className="overflow-hidden rounded-2xl border border-border-ui bg-surface"
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 font-semibold text-text-primary">{video.title}</h2>

          <p className="text-sm text-text-secondary">{video.channelTitle}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar vídeo"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-brand"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="aspect-video w-full bg-black">
        <iframe
          key={video.id}
          src={`https://www.youtube.com/embed/${video.id}`}
          title={`Reproduzindo: ${video.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </section>
  );
}
