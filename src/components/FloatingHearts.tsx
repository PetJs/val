import Float from "../assets/floatHeart.png"
import Ribbon from "../assets/ribbon.png"
import Tnagled from "../assets/tangled.png"

interface FloatingHeartsProps {
    count?: number;
}

export function FloatingHearts({ count = 15 }: FloatingHeartsProps) {
    const hearts = [Float, Ribbon, Tnagled, Float, Ribbon, Tnagled];

    return (
        <div className="floating-hearts">
            {Array.from({ length: count }).map((_, i) => {
                const size = 24 + Math.random() * 36; // 24px to 60px
                return (
                    <div
                        key={i}
                        className="floating-heart"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${3 + Math.random() * 3}s`,
                            opacity: 0.2 + Math.random() * 0.3,
                        }}
                    >
                        <img
                            src={hearts[Math.floor(Math.random() * hearts.length)]}
                            alt=""
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
