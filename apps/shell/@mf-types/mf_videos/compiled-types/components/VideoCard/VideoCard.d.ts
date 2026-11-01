import type { VideoItem } from "@icasei/contracts";
interface VideoCardProps {
    video: VideoItem;
    onPlay: (video: VideoItem) => void;
}
export declare function VideoCard({ video, onPlay }: VideoCardProps): import("react").JSX.Element;
export {};
