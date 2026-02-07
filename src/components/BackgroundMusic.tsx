import { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
    trackId: string;
    startSec?: number;
    endSec?: number;
    autoplay?: boolean;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export function BackgroundMusic({
    trackId,
    startSec = 0,
    endSec,
    autoplay = true,
}: BackgroundMusicProps) {
    // Guard: Don't render if no valid trackId
    if (!trackId) {
        return null;
    }

    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            if (!containerRef.current) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: trackId,
                playerVars: {
                    autoplay: autoplay ? 1 : 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    start: startSec,
                    end: endSec,
                    loop: 0, // We handle loop ourselves
                    playsinline: 1,
                },
                events: {
                    onReady: (event: any) => {
                        if (autoplay) {
                            event.target.playVideo();
                        }
                        // Start checking for loop
                        startLoopCheck();
                    },
                    onStateChange: (event: any) => {
                        // When video ends, restart from startSec
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.seekTo(startSec);
                            event.target.playVideo();
                        }
                    },
                },
            });
        };

        const startLoopCheck = () => {
            // Check every 500ms if we've passed endSec
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }

            checkIntervalRef.current = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    const currentTime = playerRef.current.getCurrentTime();
                    if (endSec && currentTime >= endSec) {
                        playerRef.current.seekTo(startSec);
                        playerRef.current.playVideo();
                    }
                }
            }, 500);
        };

        // Initialize player when API is ready
        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [trackId, startSec, endSec, autoplay]);

    return (
        <>
            {/* Hidden YouTube player for background audio */}
            <div
                ref={containerRef}
                className="fixed -left-[9999px] -top-[9999px] w-1 h-1 opacity-0 pointer-events-none"
                aria-hidden="true"
            />
            {/* Music indicator */}
            <div className="absolute -bottom-20 right-0 z-50 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-fade-in">
                <span className="text-lg">🎵</span>
                <span className="text-sm text-gray-600">Music playing...</span>
                <div className="flex gap-1">
                    <span className="w-1 h-3 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-4 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </>
    );
}
