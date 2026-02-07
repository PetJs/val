interface YouTubeEmbedProps {
    trackId: string;
    startSec?: number;
    endSec?: number;
    autoplay?: boolean;
}

export function YouTubeEmbed({
    trackId,
    startSec = 0,
    endSec,
    autoplay = false,
}: YouTubeEmbedProps) {
    // Build YouTube embed URL with parameters
    const params = new URLSearchParams({
        start: startSec.toString(),
        autoplay: autoplay ? '1' : '0',
        rel: '0', // Don't show related videos
        modestbranding: '1',
    });

    if (endSec) {
        params.set('end', endSec.toString());
    }

    const embedUrl = `https://www.youtube.com/embed/${trackId}?${params}`;

    return (
        <div className="youtube-container">
            <iframe
                src={embedUrl}
                title="YouTube Music Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
            />
        </div>
    );
}
