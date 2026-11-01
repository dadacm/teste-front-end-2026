import type { SearchVideosResponse } from "@icasei/contracts";
export declare function getVideos(query: string, signal: AbortSignal): Promise<SearchVideosResponse>;
