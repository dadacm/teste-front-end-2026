export interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export interface SearchVideosResponse {
  items: VideoItem[];
  nextPageToken?: string;
}
