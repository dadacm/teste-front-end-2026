import { afterEach, describe, expect, it, vi } from "vitest";

import { searchYouTubeVideos } from "./videos.service.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchYouTubeVideos", () => {
  it("normaliza os resultados retornados pelo YouTube", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        nextPageToken: "next-page",
        items: [
          {
            id: { videoId: "abc123xyz01" },
            snippet: {
              title: "teste",
              channelTitle: "Canal de Teste",
              publishedAt: "2026-01-01T00:00:00Z",
              thumbnails: {
                high: {
                  url: "https://icasei.com/thumb.jpg",
                },
              },
            },
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await searchYouTubeVideos({
      query: "react",
      apiKey: "fake-api-key",
    });

    expect(result).toEqual({
      items: [
        {
          id: "abc123xyz01",
          title: "teste",
          channelTitle: "Canal de Teste",
          publishedAt: "2026-01-01T00:00:00Z",
          thumbnailUrl: "https://icasei.com/thumb.jpg",
        },
      ],
      nextPageToken: "next-page",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("lança erro quando o YouTube retorna uma falha", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      }),
    );

    await expect(
      searchYouTubeVideos({
        query: "teste",
        apiKey: "fake-api-key",
      }),
    ).rejects.toThrow("YouTube API retornou HTTP 403");
  });
});
