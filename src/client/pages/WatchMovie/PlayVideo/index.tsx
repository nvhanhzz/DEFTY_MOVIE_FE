import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Episode } from "../index.tsx";
import "./PlayVideo.scss"; // dùng SCSS riêng nếu muốn

interface PlayVideoProps {
    episode: Episode;
}

const PlayVideo: React.FC<PlayVideoProps> = ({ episode }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // @ts-ignore
    const playerRef = useRef<videojs.Player>();

    // Tự động xác định định dạng file
    const getMimeType = (url: string): string => {
        if (url.endsWith(".mp4")) return "video/mp4";
        if (url.endsWith(".webm")) return "video/webm";
        if (url.endsWith(".ogg")) return "video/ogg";
        if (url.endsWith(".m3u8")) return "application/x-mpegURL"; // HLS
        return "video/mp4"; // fallback
    };

    useEffect(() => {
        if (videoRef.current) {
            if (playerRef.current) {
                playerRef.current.dispose();
            }

            playerRef.current = videojs(videoRef.current, {
                controls: true,
                autoplay: false,
                preload: "auto",
                poster: episode.thumbnail,
                responsive: true,
                fluid: true,
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                sources: [
                    {
                        src: episode.link,
                        type: getMimeType(episode.link),
                    },
                ],
            });

            // Thêm event listener cho việc tua video khi nhấn phím mũi tên trái/phải
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "ArrowLeft") {
                    // Tua lùi 5 giây
                    if (playerRef.current) {
                        playerRef.current.currentTime(playerRef.current.currentTime() - 5);
                    }
                } else if (event.key === "ArrowRight") {
                    // Tua tới 5 giây
                    if (playerRef.current) {
                        playerRef.current.currentTime(playerRef.current.currentTime() + 5);
                    }
                } else if (event.key === " ") {
                    // Phím Space - Dừng hoặc chơi video
                    if (playerRef.current) {
                        if (playerRef.current.paused()) {
                            playerRef.current.play();
                        } else {
                            playerRef.current.pause();
                        }
                    }
                } else if (event.key === "f" || event.key === "F") {
                    // Phím F - Phóng to hoặc thu nhỏ chế độ fullscreen
                    if (playerRef.current) {
                        if (!playerRef.current.isFullscreen()) {
                            playerRef.current.requestFullscreen();
                        } else {
                            playerRef.current.exitFullscreen();
                        }
                    }
                }
            };

            // Lắng nghe sự kiện phím
            document.addEventListener("keydown", handleKeyDown);

            // Cleanup event listener khi component bị unmount
            return () => {
                document.removeEventListener("keydown", handleKeyDown);

                if (playerRef.current) {
                    playerRef.current.dispose();
                    playerRef.current = undefined;
                }
            };
        }
    }, [episode]);

    return (
        <div className="play-video-wrapper">
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
    );
};

export default PlayVideo;