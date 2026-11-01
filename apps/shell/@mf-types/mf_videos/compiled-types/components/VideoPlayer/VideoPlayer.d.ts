import type { VideoItem } from "@icasei/contracts";
interface VideoPlayerProps {
    video: VideoItem;
    onClose: () => void;
}
export declare function VideoPlayer({ video, onClose }: VideoPlayerProps): import("react").JSX.Element;
export {};
