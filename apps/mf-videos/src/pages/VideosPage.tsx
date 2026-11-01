import { useState } from "react";
import type { SearchVideosResponse, VideoItem } from "@icasei/contracts";
import { useFetch } from "@icasei/hooks";
import "../index.css";
import { SearchInput } from "../components/SearchInput/SearchInput";
import { VideoCard } from "../components/VideoCard/VideoCard";
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer";
import { getVideos } from "../controllers/video.controller";

export function VideosPage() {
  const { data, status, error, execute, isLoading } = useFetch<SearchVideosResponse, string>(
    getVideos,
  );

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const videos = data?.items ?? [];

  function handleSearch(query: string) {
    setSelectedVideo(null);
    void execute(query);
  }

  function handlePlay(video: VideoItem) {
    setSelectedVideo(video);
  }

  function handleClosePlayer() {
    setSelectedVideo(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Explore vídeos</h1>

        <p className="text-text-secondary">Pesquise, assista e encontre seus vídeos favoritos.</p>
      </header>

      <SearchInput onSearch={handleSearch} isLoading={isLoading} />

      {selectedVideo && <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />}

      {status === "idle" && (
        <div className="rounded-2xl border border-border-ui bg-surface p-8 text-center">
          <p className="text-text-secondary">Faça uma pesquisa para encontrar vídeos.</p>
        </div>
      )}

      {isLoading && (
        <div
          role="status"
          className="rounded-2xl border border-border-ui bg-surface p-8 text-center"
        >
          <p className="text-text-secondary">Buscando vídeos...</p>
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6">
          <p className="text-red-200">{error ?? "Não foi possível buscar os vídeos."}</p>
        </div>
      )}

      {status === "success" && videos.length === 0 && (
        <div className="rounded-2xl border border-border-ui bg-surface p-8 text-center">
          <p className="text-text-secondary">Nenhum vídeo encontrado.</p>
        </div>
      )}

      {status === "success" && videos.length > 0 && (
        <section aria-label="Resultados da pesquisa">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Resultados</h2>

            <span className="text-sm text-text-secondary">{videos.length} vídeos</span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={handlePlay} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default VideosPage;
