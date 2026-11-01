import type { SearchVideosResponse } from "@icasei/contracts";

import { searchVideos } from "../services/videos.api";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export async function getVideos(query: string, signal: AbortSignal): Promise<SearchVideosResponse> {
  if (useMocks) {
    const { searchVideosMock } = await import("../mocks/videos.mock");

    return searchVideosMock(query);
  }

  return searchVideos(query, signal);
}
