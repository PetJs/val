import { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
    trackId: string;
    startSec?: number;
    endSec?: number;
    autoplay?: boolean;
    volume?: number; // 0-100
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
    volume = 100,
}: BackgroundMusicProps) {
    // Guard: Don't render if no valid trackId
    if (!trackId) {
        return null;
    }

    const playerRef = useRef<any>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const playerContainerId = useRef<string>(`yt-player-${Math.random().toString(36).substr(2, 9)}`);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Create the player container dynamically
        const createPlayerContainer = () => {
            if (!wrapperRef.current) return null;

            // Clear any existing content
            wrapperRef.current.innerHTML = '';

            // Create a new div for the player
            const playerDiv = document.createElement('div');
            playerDiv.id = playerContainerId.current;
            wrapperRef.current.appendChild(playerDiv);

            return playerDiv.id;
        };

        const initPlayer = () => {
            const containerId = createPlayerContainer();
            if (!containerId) return;

            playerRef.current = new window.YT.Player(containerId, {
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
                    loop: 0,
                    playsinline: 1,
                },
                events: {
                    onReady: (event: any) => {
                        if (autoplay) {
                            event.target.playVideo();
                        }
                        startLoopCheck();
                    },
                    onStateChange: (event: any) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.seekTo(startSec);
                            event.target.playVideo();
                        }
                    },
                },
            });
        };

        const startLoopCheck = () => {
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
            // Clean up interval
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }

            // Destroy player safely
            if (playerRef.current) {
                try {
                    if (playerRef.current.destroy) {
                        playerRef.current.destroy();
                    }
                } catch (e) {
                    // Ignore errors during cleanup
                }
                playerRef.current = null;
            }

            // Manually clear the wrapper content to prevent React DOM conflicts
            if (wrapperRef.current) {
                wrapperRef.current.innerHTML = '';
            }
        };
    }, [trackId, startSec, endSec, autoplay]);

    // Update volume when prop changes
    useEffect(() => {
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(volume);
        }
    }, [volume]);

    return (
        <>
            {/* Wrapper div that React manages - player container is created inside dynamically */}
            <div
                ref={wrapperRef}
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
