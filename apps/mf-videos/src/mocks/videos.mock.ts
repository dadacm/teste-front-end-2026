import type { SearchVideosResponse } from "@icasei/contracts";

const videos: SearchVideosResponse["items"] = [
  {
    id: "video123abc",
    title: "Vídeo de teste",
    channelTitle: "iCasei",
    thumbnailUrl: "https://placehold.co/640x360",
    publishedAt: "2026-10-01T12:00:00Z",
  },
  {
    id: "video456def",
    title: "Outro vídeo de teste",
    channelTitle: "Canal de teste",
    thumbnailUrl: "https://placehold.co/640x360",
    publishedAt: "2026-10-02T12:00:00Z",
  },
];

export async function searchVideosMock(query: string): Promise<SearchVideosResponse> {
  const normalizedQuery = query.trim().toLowerCase();

  const items = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(normalizedQuery) ||
      video.channelTitle.toLowerCase().includes(normalizedQuery),
  );

  return { items };
}
