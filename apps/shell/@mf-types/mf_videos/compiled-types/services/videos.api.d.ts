import type { SearchVideosResponse } from "@icasei/contracts";
export declare function searchVideos(query: string, signal?: AbortSignal): Promise<SearchVideosResponse>;
