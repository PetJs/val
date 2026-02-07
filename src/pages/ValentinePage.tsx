import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { getInvite, acceptInvite, declineInvite } from '../lib/api';
import type { InviteResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BackgroundMusic } from '../components/BackgroundMusic';
import { FloatingHearts } from '../components/FloatingHearts';
import { FullPageLoader } from '../components/ui/LoadingSpinner';
import LoveImg from "../assets/cute_love-r.png";
import KissImg from "../assets/buny_hug_love-r.png";
import toast from 'react-hot-toast';

export function ValentinePage() {
    const { token } = useParams<{ token: string }>();
    const [invite, setInvite] = useState<InviteResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchInvite = async () => {
            try {
                const data = await getInvite(token);
                setInvite(data);

                // Trigger confetti if already accepted
                if (data.state === 'ACCEPTED') {
                    triggerConfetti();
                }
            } catch (err) {
                console.error('Error fetching invite:', err);
                setError(err instanceof Error ? err.message : 'Failed to load invite');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvite();
    }, [token]);

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#f43f5e', '#ec4899', '#f472b6', '#fda4af'],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#f43f5e', '#ec4899', '#f472b6', '#fda4af'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    };

    const handleAccept = async () => {
        if (!token || !invite) return;

        setIsAccepting(true);
        try {
            const acceptResponse = await acceptInvite(token);
            toast.success('You accepted the invite! 💕');
            console.log('Accept response:', acceptResponse);

            // Merge the acceptance data with existing invite
            const updatedInvite: InviteResponse = {
                ...invite,
                state: 'ACCEPTED',
                personalized_message: acceptResponse.data.personalized_message,
                meetup_time: acceptResponse.data.meetup_time,
                vn_url: acceptResponse.data.vn_url,
            };

            console.log('Updated invite:', updatedInvite);
            setInvite(updatedInvite);
            triggerConfetti();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to accept invite');
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDecline = async () => {
        if (!token) return;

        setIsDeclining(true);
        try {
            await declineInvite(token);
            toast.success('Invite declined');

            // Refetch to update state
            const updatedInvite = await getInvite(token);
            setInvite(updatedInvite);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to decline invite');
        } finally {
            setIsDeclining(false);
            setShowDeclineModal(false);
        }
    };

    const formatMeetupDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return <FullPageLoader />;
    }

    if (error || !invite) {
        return (
            <div className="min-h-screen gradient-bg-soft flex items-center justify-center px-4">
                <div className="card text-center max-w-md">
                    <span className="text-6xl mb-4 block">😢</span>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
                    <p className="text-gray-600">{error || 'Invite not found'}</p>
                </div>
            </div>
        );
    }

    // EXPIRED State
    if (invite.state === 'EXPIRED') {
        return (
            <div className="min-h-screen love-ya-like-a-sister-regular gradient-bg-soft flex items-center justify-center px-4">
                <div className="card text-center max-w-md">
                    <span className="text-6xl mb-4 block">⏰</span>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Invite Expired</h1>
                    <p className="text-gray-600">
                        Unfortunately, this Valentine's invite has expired.
                    </p>
                </div>
            </div>
        );
    }

    // REJECTED State
    if (invite.state === 'REJECTED') {
        return (
            <div className="min-h-screen love-ya-like-a-sister-regular gradient-bg-soft flex items-center justify-center px-4">
                <div className="card text-center max-w-md">
                    <span className="text-6xl mb-4 block">💔</span>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Invite Declined</h1>
                    <p className="text-gray-600">
                        This invite was declined. Maybe next time! 🌹
                    </p>
                </div>
            </div>
        );
    }

    // ACCEPTED State
    if (invite.state === 'ACCEPTED') {
        return (
            <div className="min-h-screen love-ya-like-a-sister-regular gradient-bg relative overflow-hidden">
                <FloatingHearts count={25} />

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4! py-8!">
                    <div className="max-w-lg w-full celebration-zone animate-fade-in">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <img src={KissImg} alt="" />
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                I LOVE LOVE LOVE YOU!! {invite.val_name}!
                            </h1>
                            <p className="text-gray-600 mt-2">
                                From {invite.creator_name}
                            </p>
                        </div>

                        {/* Personal Message */}
                        {invite.personalized_message && (
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 mb-6">
                                <h3 className="font-semibold text-rose-600 mb-3">Psst... Read This When No One's Looking 👀</h3>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {invite.personalized_message}
                                </p>
                            </div>
                        )}

                        {/* Voice Note */}
                        {invite.vn_url && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Put Your Headphones In... 🎧💋</h3>
                                <audio src={invite.vn_url} controls className="w-full" />
                            </div>
                        )}

                        {/* Background Music */}
                        <BackgroundMusic
                            key="accepted-music"
                            trackId={invite.music_track_id}
                            startSec={invite.music_start_sec}
                            endSec={invite.music_end_sec}
                            autoplay={true}
                        />

                        {/* Meetup Details */}
                        <div className="bg-rose-500 text-white rounded-xl p-6 text-center">
                            <h3 className="font-semibold mb-2">Clear Your Schedule, Cutie</h3>
                            <p className="text-lg font-bold">
                                {formatMeetupDate(invite.meetup_time)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // PENDING State (Default)
    return (
        <div className="min-h-screen love-ya-like-a-sister-regular gradient-bg relative overflow-hidden">
            <FloatingHearts count={15} />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4! py-8!">
                <div className="max-w-lg w-full text-center animate-fade-in">
                    {/* Greeting */}
                    <div className="mb-6">
                        <img src={LoveImg} alt="" className='animate-heartbeat' />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Hey {invite.val_name}! 💕
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Someone special sent you a Valentine's invite...
                        </p>
                    </div>

                    {/* Teaser */}
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 mb-6!">
                        <p className="text-gray-700 italic text-lg">
                            "{invite.teaser_text}"
                        </p>
                        <p className="text-sm text-rose-600 mt-3 font-medium">
                            — {invite.creator_name}
                        </p>
                    </div>

                    {/* Background Music */}
                    <BackgroundMusic
                        key="pending-music"
                        trackId={invite.music_track_id}
                        startSec={invite.music_start_sec}
                        endSec={invite.music_end_sec}
                        autoplay={true}
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="primary"
                            onClick={handleAccept}
                            isLoading={isAccepting}
                            className="flex-1 py-4"
                        >
                            💕 Accept & See More
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeclineModal(true)}
                            disabled={isAccepting}
                            className="flex-1 py-4"
                        >
                            Maybe Not...
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decline Confirmation Modal */}
            <Modal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                title="Are you sure? 💔"
                confirmLabel="Yes, Decline"
                confirmVariant="danger"
                onConfirm={handleDecline}
                isLoading={isDeclining}
            >
                <p>
                    {invite.creator_name} put a lot of thought into this invite.
                    Are you sure you want to decline?
                </p>
            </Modal>
        </div>
    );
}
