import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FloatingHearts } from '../components/FloatingHearts';

export function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-[#FB95BA] relative overflow-hidden">
            <FloatingHearts count={20} />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
                {/* Hero Section */}
                <div className="text-center max-w-xl mx-auto">
                    <div className='w-full flex justify-center items-center'>
                        <video src="https://res.cloudinary.com/dm7vlpslq/video/upload/v1770338115/5a0f37e97a014a32839d5566f2eab043_ddxc5x.webm" autoPlay loop muted className='w-full h-auto'/>
                    </div>
                    <p className="text-lg md:text-xl love-ya-like-a-sister-regular text-white/90 mb-10 leading-relaxed">
                        It's the season of Love and wha better way than to spend it with someone you deeply care about.
                        Send her a customaixe request to be your vall!!. 
                    </p>

                    {/* CTA Button */}
                    <Link to="/create">
                        <Button
                            variant="secondary"
                            className="text-lg px-8 py-4 font-bold shadow-2xl hover:scale-105 transition-transform"
                        >
                            Create Your Valentine Link
                        </Button>
                    </Link>

                </div>
            </div>
        </div>
    );
}
