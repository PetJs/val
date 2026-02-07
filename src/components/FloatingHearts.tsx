interface FloatingHeartsProps {
    count?: number;
}

export function FloatingHearts({ count = 15 }: FloatingHeartsProps) {
    const hearts = ['💕', '❤️', '💖', '💗', '💓', '💝'];

    return (
        <div className="floating-hearts">
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className="floating-heart"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${3 + Math.random() * 3}s`,
                        fontSize: `${1 + Math.random() * 1.5}rem`,
                        opacity: 0.2 + Math.random() * 0.3,
                    }}
                >
                    {hearts[Math.floor(Math.random() * hearts.length)]}
                </span>
            ))}
        </div>
    );
}
