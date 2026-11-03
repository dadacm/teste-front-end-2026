import type { VideoItem } from "@icasei/contracts";

export interface VideoPlayerProps {
  video: Pick<VideoItem, "id" | "title" | "channelTitle">;
  onClose: () => void;
}
