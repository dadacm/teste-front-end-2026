import { useEffect, useState } from "react";
import type {
  CreateFavoriteInput,
  FavoriteItem,
  FavoritesResponse,
  SearchVideosResponse,
  VideoItem,
} from "@icasei/contracts";
import { useFetch } from "@icasei/hooks";
import "../index.css";
import { SearchInput } from "../components/SearchInput/SearchInput";
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer";
import { LoadingSpinner } from "../components/LoaddingSpinner/LoaddingSpinner";
import { getVideos } from "../controllers/video.controller";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorites.controller";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { VideoList } from "../components/VideoList/VideoList";
import { Search, SearchX } from "lucide-react";

export function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());

  const [busyVideoId, setBusyVideoId] = useState<string | null>(null);

  const { data, error, status, execute, isLoading } = useFetch<SearchVideosResponse, string>(
    getVideos,
  );

  const {
    error: favoritesError,
    status: favoritesStatus,
    execute: loadFavorites,
  } = useFetch<FavoritesResponse, void>(getFavorites, {
    onSuccess: (response) => {
      setFavoriteIds(new Set(response.items.map((favorite) => favorite.id)));
      setBusyVideoId(null);
    },
    onError: () => {
      setBusyVideoId(null);
    },
  });

  const { error: addFavoriteError, execute: executeAddFavorite } = useFetch<
    FavoriteItem,
    CreateFavoriteInput
  >(addFavorite, {
    onSuccess: () => {
      void loadFavorites(undefined);
    },
    onError: () => {
      setBusyVideoId(null);
    },
  });

  const { error: removeFavoriteError, execute: executeRemoveFavorite } = useFetch<void, string>(
    removeFavorite,
    {
      onSuccess: () => {
        void loadFavorites(undefined);
      },
      onError: () => {
        setBusyVideoId(null);
      },
    },
  );

  useEffect(() => {
    void loadFavorites(undefined);
  }, [loadFavorites]);

  const videosList = data?.items ?? [];

  const favoriteMutationError = addFavoriteError ?? removeFavoriteError;

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

  function handleToggleFavorite(video: VideoItem) {
    if (favoritesStatus !== "success" || busyVideoId !== null) {
      return;
    }

    setBusyVideoId(video.id);

    if (favoriteIds.has(video.id)) {
      void executeRemoveFavorite(video.id);
      return;
    }

    void executeAddFavorite({
      id: video.id,
      title: video.title,
      channelTitle: video.channelTitle,
      thumbnailUrl: video.thumbnailUrl,
    });
  }

  const renderVideoPlayer = () =>
    selectedVideo && <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />;

  const renderSearchContent = () => {
    switch (status) {
      case "idle":
        return (
          <EmptyState
            icon={<Search size={28} aria-hidden="true" />}
            title="Encontre seus vídeos"
            description="Digite o nome de um vídeo ou assunto para começar a pesquisar."
          />
        );

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
          return (
            <EmptyState
              icon={<SearchX size={28} aria-hidden="true" />}
              title="Nenhum vídeo encontrado"
              description="Não encontramos resultados para sua pesquisa. Tente utilizar outros termos."
            />
          );
        }

        return (
          <VideoList
            videos={videosList}
            label="Resultados da pesquisa"
            onPlay={handlePlay}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={(video) => favoriteIds.has(video.id)}
            favoriteLoadingId={busyVideoId}
            disableFavoriteActions={favoritesStatus !== "success" || busyVideoId !== null}
          />
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

      {(favoritesStatus === "idle" || favoritesStatus === "loading") && (
        <p role="status" className="text-sm text-text-secondary">
          Sincronizando favoritos...
        </p>
      )}

      {favoritesStatus === "error" && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
        >
          <p>{favoritesError ?? "Não foi possível carregar os favoritos."}</p>

          <button
            type="button"
            onClick={() => void loadFavorites(undefined)}
            className="font-semibold underline underline-offset-2"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {favoriteMutationError && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
        >
          {favoriteMutationError}
        </p>
      )}

      {renderVideoPlayer()}

      {renderSearchContent()}
    </div>
  );
}

export default VideosPage;
