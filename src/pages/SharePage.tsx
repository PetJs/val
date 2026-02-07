import { useLocation, useParams, Link } from 'react-router-dom';
import { ShareButtons } from '../components/ShareButtons';
import { FloatingHearts } from '../components/FloatingHearts';
import { Button } from '../components/ui/Button';
import CuteLove from '../assets/share_lovr.jpg';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock04Icon } from '@hugeicons/core-free-icons';

interface LocationState {
    link: string;
    valName: string;
    expiresAt: string;
}

export function SharePage() {
    const { token } = useParams<{ token: string }>();
    const location = useLocation();
    const state = location.state as LocationState | null;

    const link = state?.link || `${window.location.origin}/v/${token}`;
    const valName = state?.valName || 'Your Valentine';
    const expiresAt = state?.expiresAt;

    const formatExpiry = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen gradient-bg relative overflow-hidden">
            <FloatingHearts count={15} />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
                <div className="card max-w-lg w-full text-center animate-fade-in">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <img src={CuteLove} alt="" className='animate-heartbeat' />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Your Invite is Ready!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Share this link with <span className="font-semibold text-rose-600">{valName}</span>
                    </p>

                    {/* Share Section */}
                    <ShareButtons link={link} valName={valName} />

                    {/* Expiry Info */}
                    {expiresAt && (
                        <div className="mt-6 p-4 bg-rose-50 rounded-xl justify-center! items-center! flex! flex-col!">
                            <p className="text-sm text-gray-600 mr-1!">
                                <span className='flex gap-2 text-center items-center'>
                                    <HugeiconsIcon
                                        icon={Clock04Icon}
                                        size={24}
                                        color="#FC76A7"
                                        strokeWidth={1.5}
                                    />
                                    This invite expires on
                                </span>
                            </p>
                            <span className="font-medium text-gray-800 block ">
                                {formatExpiry(expiresAt)}
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-2! flex flex-col sm:flex-row gap-3">
                        <Link to="/create" className="flex-1">
                            <Button variant="secondary" className="w-full">
                                Create Another
                            </Button>
                        </Link>
                        <Link to="/" className="flex-1">
                            <Button variant="outline" className="w-full text-rose-600 border-rose-300">
                                Back Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
