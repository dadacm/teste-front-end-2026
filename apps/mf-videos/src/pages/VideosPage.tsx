import { useState } from "react";
import type { SearchVideosResponse, VideoItem } from "@icasei/contracts";
import { useFetch } from "@icasei/hooks";
import "../index.css";
import { SearchInput } from "../components/SearchInput/SearchInput";
import { VideoCard } from "../components/VideoCard/VideoCard";
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer";
import { getVideos } from "../controllers/video.controller";
import { LoadingSpinner } from "../components/LoaddingSpinner/LoaddingSpinner";

export function VideosPage() {
  const { data, error, status, execute, isLoading } = useFetch<SearchVideosResponse, string>(
    getVideos,
  );

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const videosList = data?.items ?? [];

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

  const renderVideoPlayer = () =>
    selectedVideo && <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />;

  const renderVideosList = () =>
    videosList.map((video) => <VideoCard key={video.id} video={video} onPlay={handlePlay} />);

  const renderSearchContent = () => {
    switch (status) {
      case "idle":
        return <p className="text-text-secondary">Faça uma pesquisa para encontrar vídeos.</p>;

      case "loading":
        return (
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        );

      case "error":
        return (
          <p role="alert" className="text-red-200">
            {error ?? "Não foi possível buscar os vídeos."}
          </p>
        );

      case "success":
        if (videosList.length === 0) {
          return <p>Nenhum vídeo encontrado.</p>;
        }

        return (
          <section aria-label="Resultados da pesquisa">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {renderVideosList()}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Explore vídeos</h1>

        <p className="text-text-secondary">Pesquise, assista e encontre seus vídeos favoritos.</p>
      </header>

      <SearchInput onSearch={handleSearch} isLoading={isLoading} />

      {renderVideoPlayer()}

      {renderSearchContent()}
    </div>
  );
}

export default VideosPage;
