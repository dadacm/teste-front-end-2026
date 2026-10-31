import type { SearchVideosResponse } from "@icasei/contracts";

interface YouTubeSearchResponse {
  nextPageToken?: string;
  items?: Array<{
    id?: {
      videoId?: string;
    };
    snippet?: {
      title: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails?: {
        high?: { url: string };
        medium?: { url: string };
        default?: { url: string };
      };
    };
  }>;
}

interface SearchYouTubeParams {
  query: string;
  apiKey: string;
  pageToken?: string;
}

export async function searchYouTubeVideos({
  query,
  apiKey,
  pageToken,
}: SearchYouTubeParams): Promise<SearchVideosResponse> {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");

  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("maxResults", "12");
  url.searchParams.set("q", query);
  url.searchParams.set("key", apiKey);

  if (pageToken) {
    url.searchParams.set("pageToken", pageToken);
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`YouTube API retornou HTTP ${response.status}`);
  }

  const data = (await response.json()) as YouTubeSearchResponse;

  const items = (data.items ?? []).flatMap((item) => {
    const videoId = item.id?.videoId;
    const snippet = item.snippet;

    if (!videoId || !snippet) {
      return [];
    }

    return [
      {
        id: videoId,
        title: snippet.title,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        thumbnailUrl:
          snippet.thumbnails?.high?.url ??
          snippet.thumbnails?.medium?.url ??
          snippet.thumbnails?.default?.url ??
          "",
      },
    ];
  });

  return {
    items,
    ...(data.nextPageToken && {
      nextPageToken: data.nextPageToken,
    }),
  };
}
