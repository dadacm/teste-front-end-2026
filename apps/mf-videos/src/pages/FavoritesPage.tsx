import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { FavoriteItem, FavoritesResponse } from "@icasei/contracts";
import { useFetch } from "@icasei/hooks";
import "../index.css";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../components/LoaddingSpinner/LoaddingSpinner";
import { VideoList } from "../components/VideoList/VideoList";
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer";
import { getFavorites, removeFavorite } from "../controllers/favorites.controller";

export function FavoritesPage() {
  const [selectedVideo, setSelectedVideo] = useState<FavoriteItem | null>(null);

  const [removingVideoId, setRemovingVideoId] = useState<string | null>(null);

  const {
    data,
    error,
    status,
    execute: loadFavorites,
  } = useFetch<FavoritesResponse, void>(getFavorites);

  const { error: removeError, execute: executeRemoveFavorite } = useFetch<void, string>(
    removeFavorite,
    {
      onSuccess: () => {
        setRemovingVideoId(null);
        setSelectedVideo(null);

        void loadFavorites(undefined);
      },
      onError: () => {
        setRemovingVideoId(null);
      },
    },
  );

  useEffect(() => {
    void loadFavorites(undefined);
  }, [loadFavorites]);

  const favorites = data?.items ?? [];

  function handlePlay(video: FavoriteItem) {
    setSelectedVideo(video);
  }

  function handleClosePlayer() {
    setSelectedVideo(null);
  }

  function handleRemoveFavorite(videoId: string) {
    if (removingVideoId !== null) {
      return;
    }

    setRemovingVideoId(videoId);

    void executeRemoveFavorite(videoId);
  }

  const renderVideoPlayer = () =>
    selectedVideo && <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />;

  const renderFavoritesContent = () => {
    switch (status) {
      case "idle":
      case "loading":
        return (
          <div role="status" className="flex min-h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        );

      case "error":
        return (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-5 text-red-200"
          >
            <p>{error ?? "Não foi possível carregar seus favoritos."}</p>

            <button
              type="button"
              onClick={() => void loadFavorites(undefined)}
              className="font-semibold underline underline-offset-2"
            >
              Tentar novamente
            </button>
          </div>
        );

      case "success":
        if (favorites.length === 0) {
          return (
            <EmptyState
              icon={<Heart size={28} aria-hidden="true" />}
              title="Nenhum favorito por enquanto"
              description="Explore os vídeos e clique na estrela para salvar os seus favoritos aqui."
              action={
                <a
                  href="/videos"
                  className="rounded-lg bg-brand px-5 py-3 font-semibold text-background transition-colors hover:bg-brand-hover"
                >
                  Explorar vídeos
                </a>
              }
            />
          );
        }

        return (
          <VideoList
            videos={favorites}
            label="Lista de favoritos"
            onPlay={handlePlay}
            onToggleFavorite={(video) => handleRemoveFavorite(video.id)}
            isFavorite={() => true}
            favoriteLoadingId={removingVideoId}
            disableFavoriteActions={removingVideoId !== null}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Meus favoritos</h1>

        <p className="text-text-secondary">Seus vídeos salvos em um só lugar.</p>

        {status === "success" && (
          <p className="text-sm font-medium text-brand">
            {favorites.length} {favorites.length === 1 ? "vídeo favorito" : "vídeos favoritos"}
          </p>
        )}
      </header>

      {removeError && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
        >
          {removeError}
        </p>
      )}

      {renderVideoPlayer()}

      {renderFavoritesContent()}
    </div>
  );
}

export default FavoritesPage;
