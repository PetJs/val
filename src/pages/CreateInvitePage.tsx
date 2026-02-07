import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/InputField';
import { AudioRecorder } from '../components/AudioRecorder';
import { MusicSearch } from '../components/MusicSearch';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { DateTimePicker } from '../components/DateTimePicker';
import { FloatingHearts } from '../components/FloatingHearts';
import { createInvite, uploadVoiceNote } from '../lib/api';
import type { MusicTrack, CreateInviteRequest } from '../types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, HeartCheckIcon, MusicNote01Icon } from '@hugeicons/core-free-icons';

type VoiceNoteMode = 'none' | 'record' | 'upload';

interface FormErrors {
    [key: string]: string;
}

export function CreateInvitePage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voiceNoteMode, setVoiceNoteMode] = useState<VoiceNoteMode>('none');
    const [voiceNoteBlob, setVoiceNoteBlob] = useState<Blob | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    // Form state
    const [valName, setValName] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [creatorEmail, setCreatorEmail] = useState('');
    const [teaserText, setTeaserText] = useState('');
    const [personalizedMessage, setPersonalizedMessage] = useState('');
    const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(30);
    const [meetupTime, setMeetupTime] = useState('');

    const [steps, setSteps] = useState(1)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!valName.trim()) newErrors.valName = 'Valentine\'s name is required';
        if (!creatorName.trim()) newErrors.creatorName = 'Your name is required';
        if (!creatorEmail.trim()) {
            newErrors.creatorEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorEmail)) {
            newErrors.creatorEmail = 'Please enter a valid email';
        }
        if (!teaserText.trim()) newErrors.teaserText = 'Teaser text is required';
        if (!personalizedMessage.trim()) newErrors.personalizedMessage = 'Personal message is required';
        if (!selectedTrack) newErrors.music = 'Please select a song';
        if (!meetupTime) {
            newErrors.meetupTime = 'Meetup time is required';
        } else if (new Date(meetupTime) <= new Date()) {
            newErrors.meetupTime = 'Meetup time must be in the future';
        }

        const clipDuration = endTime - startTime;
        if (clipDuration > 30) newErrors.timeRange = 'Music clip cannot exceed 30 seconds';
        if (endTime <= startTime) newErrors.timeRange = 'End time must be after start time';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePrevious = () => {
        if (steps > 1) {
            setSteps((prev) => prev - 1);
        }
    };
    const handleNext = () => {
        // Optional: Add a 'validateStep' here to prevent moving forward with empty fields
        if (steps < 6) {
            setSteps(prev => prev + 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload voice note if present
            let vnUrl: string | undefined;
            if (voiceNoteBlob) {
                toast.loading('Uploading voice note...', { id: 'upload' });
                const uploadResult = await uploadVoiceNote(voiceNoteBlob);
                vnUrl = uploadResult.data.url;
                toast.success('Voice note uploaded!', { id: 'upload' });
            }

            // Create the invite
            const inviteData: CreateInviteRequest = {
                val_name: valName.trim(),
                creator_name: creatorName.trim(),
                creator_email: creatorEmail.trim(),
                teaser_text: teaserText.trim(),
                personalized_message: personalizedMessage.trim(),
                vn_url: vnUrl,
                music_provider: 'YOUTUBE',
                music_track_id: selectedTrack!.trackId,
                music_start_sec: startTime,
                music_end_sec: endTime,
                meetup_time: new Date(meetupTime).toISOString(),
            };

            toast.loading('Creating your invite...', { id: 'create' });
            const result = await createInvite(inviteData);
            toast.success('Valentine invite created! 💕', { id: 'create' });

            // Navigate to share page
            navigate(`/share/${result.data.token}`, {
                state: {
                    link: result.data.link,
                    valName: valName.trim(),
                    expiresAt: result.data.expires_at
                }
            });
        } catch (error) {
            console.error('Error creating invite:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create invite');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVoiceNoteComplete = (blob: Blob) => {
        setVoiceNoteBlob(blob);
    };

    return (
        <div className="min-h-screen love-ya-like-a-sister-regular gradient-bg-soft relative">
            <FloatingHearts count={10} />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Lets get some details
                    </h1>
                    {/* Step indicator */}
                    {/* <p className="text-gray-500">Step {steps} of 6</p> */}
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        // Prevent Enter key from submitting form - only submit via button click
                        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                            e.preventDefault();
                        }
                    }}
                    className="flex flex-col items-center w-full max-w-md mx-auto gap-4 p-2!"
                >

                    {steps === 1 && (
                        <div className=" animate-fade-in w-full" style={{ animationDelay: '0.4s' }}>
                            <InputField
                                label="Valentine's Name"
                                placeholder="Who is this for?"
                                value={valName}
                                onChange={(e) => setValName(e.target.value)}
                                error={errors.valName}
                            />
                        </div>
                    )}


                    {steps === 2 && (
                        <div className=" animate-fade-in w-full" style={{ animationDelay: '0.2s' }}>
                            <div className='space-y-4 w-full'>
                                <InputField
                                    label='Teaser Text'
                                    placeholder="A teasser they'll see before accepting"
                                    value={teaserText}
                                    onChange={(e) => setTeaserText(e.target.value)}
                                    error={errors.teaserText}
                                    multiline
                                    rows={3}
                                />
                                <InputField
                                    label="Personalized Message"
                                    placeholder="Your heartfelt message (revealed after they accept)..."
                                    value={personalizedMessage}
                                    onChange={(e) => setPersonalizedMessage(e.target.value)}
                                    error={errors.personalizedMessage}
                                    multiline
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}


                    {/* Voice Note Section */}
                    {steps === 3 && (
                        <div className=" animate-fade-in w-full" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                Record a Personalised message for your val <span className="text-sm font-normal text-gray-500">(opt)</span>
                            </h2>

                            {/* Mode Selector */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => { setVoiceNoteMode('none'); setVoiceNoteBlob(null); }}
                                    className={`px-4! py-2! rounded-xl w-fit flex justify-center items-center text-center font-medium transition-all
                            ${voiceNoteMode === 'none'
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    None
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setVoiceNoteMode('record'); setVoiceNoteBlob(null); }}
                                    className={`px-4! py-2! rounded-lg flex justify-center items-center text-center  font-medium transition-all
                            ${voiceNoteMode === 'record'
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Record
                                </button>
                            </div>
                            {voiceNoteMode === 'record' && (
                                <AudioRecorder onRecordingComplete={handleVoiceNoteComplete} />
                            )}

                            {voiceNoteBlob && (
                                <p className="text-sm text-green-600 mt-2">✓ Voice note ready</p>
                            )}
                        </div>
                    )}

                    {steps === 4 && (
                        <div className=" animate-fade-in w-full" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <HugeiconsIcon
                                    icon={MusicNote01Icon}
                                    size={24}
                                    color="#FC76A7"
                                    strokeWidth={1.5}
                                />
                                Choose Music
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Search for a Song
                                    </label>
                                    <MusicSearch
                                        selectedTrack={selectedTrack}
                                        onSelect={setSelectedTrack}
                                    />
                                    {errors.music && (
                                        <p className="text-sm text-red-500 mt-2">{errors.music}</p>
                                    )}
                                </div>

                                {selectedTrack && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Time Range
                                        </label>
                                        <TimeRangeSelector
                                            maxDuration={selectedTrack.duration}
                                            startTime={startTime}
                                            endTime={endTime}
                                            onStartChange={setStartTime}
                                            onEndChange={setEndTime}
                                        />
                                        {errors.timeRange && (
                                            <p className="text-sm text-red-500 mt-2">{errors.timeRange}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {steps === 5 && (
                        <div className=" animate-fade-in w-full" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <HugeiconsIcon
                                    icon={Calendar03Icon}
                                    size={24}
                                    color="#FC76A7"
                                    strokeWidth={1.5}
                                />
                                Set a date to enjoy that day together
                            </h2>

                            <DateTimePicker
                                label="When would you like to meet?"
                                value={meetupTime}
                                onChange={setMeetupTime}
                                error={errors.meetupTime}
                            />
                        </div>
                    )}

                    {steps === 6 && (
                        <div className=" animate-fade-in w-full" style={{ animationDelay: '0.4s' }}>
                            <div className="space-y-4">
                                <InputField
                                    label="Your Name"
                                    placeholder="Your name"
                                    value={creatorName}
                                    onChange={(e) => setCreatorName(e.target.value)}
                                    error={errors.creatorName}
                                />

                                <InputField
                                    label="Your Email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={creatorEmail}
                                    onChange={(e) => setCreatorEmail(e.target.value)}
                                    error={errors.creatorEmail}
                                />
                            </div>
                        </div>
                    )}
                    {/* Submit Button */}
                    <div className="flex justify-center gap-3 pt-4">
                        {steps > 1 && (
                            <Button
                                type="button"
                                variant="secondary" // Assuming a secondary style exists
                                onClick={handlePrevious}
                                className="text-lg px-6 py-4"
                            >
                                Previous
                            </Button>
                        )}
                        {steps < 6 ? (
                            <Button
                                type="button" // Use button type so it doesn't trigger form submit
                                variant="primary"
                                onClick={handleNext}
                                className="text-lg px-10 py-4 animate-pulse-glow"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit" // Final step triggers the form onSubmit
                                variant="primary"
                                isLoading={isSubmitting}
                                className="text-lg px-10 py-4 animate-pulse-glow"
                            >
                                <HugeiconsIcon
                                    icon={HeartCheckIcon}
                                    size={24}
                                    color="currentColor"
                                    strokeWidth={1.5}
                                />
                                Create Valentine Invite
                            </Button>
                        )}
                    </div>
                </form>
            </div >
        </div >
    );
}
