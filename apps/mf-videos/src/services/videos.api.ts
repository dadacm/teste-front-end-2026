import type { SearchVideosResponse } from "@icasei/contracts";

export async function searchVideos(
  query: string,
  signal?: AbortSignal,
): Promise<SearchVideosResponse> {
  const params = new URLSearchParams({
    q: query,
  });

  const response = await fetch(`/api/videos/search?${params.toString()}`, {
    credentials: "include",
    signal,
  });

  if (response.status === 401) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível buscar os vídeos.");
  }

  return (await response.json()) as SearchVideosResponse;
}
