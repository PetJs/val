import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete03Icon, Mic01Icon, StopIcon } from '@hugeicons/core-free-icons';

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    maxDuration?: number; // in seconds
}

export function AudioRecorder({
    onRecordingComplete,
    maxDuration = 30
}: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onRecordingComplete(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);
            setAudioUrl(null);

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => {
                    if (prev >= maxDuration - 1) {
                        stopRecording();
                        return maxDuration;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    }, [maxDuration, onRecordingComplete]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const clearRecording = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
        setDuration(0);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {!isRecording && !audioUrl && (
                    <Button variant="primary" onClick={startRecording}>
                        <HugeiconsIcon
                            icon={Mic01Icon}
                            size={24}
                            color="#FC76A7"
                            strokeWidth={1.5}
                        /> 
                        Start Recording
                    </Button>
                )}

                {isRecording && (
                    <>
                        <Button variant="danger" onClick={stopRecording}>
                            <HugeiconsIcon
                                icon={StopIcon}
                                size={24}
                                color="#FC76A7"
                                strokeWidth={1.5}
                            />
                            Stop
                        </Button>
                        <div className="recording-indicator">
                            <span className="recording-dot" />
                            <span className="text-red-500 font-medium">
                                {formatTime(duration)} / {formatTime(maxDuration)}
                            </span>
                        </div>
                    </>
                )}

                {audioUrl && !isRecording && (
                    <>
                        <audio src={audioUrl} controls className="flex-1" />
                        <Button variant="secondary" onClick={clearRecording}>
                            <HugeiconsIcon
                                icon={Delete03Icon}
                                size={24}
                                color="#FC76A7"
                                strokeWidth={1.5}
                            />
                            Clear
                        </Button>
                    </>
                )}
            </div>

            {!audioUrl && !isRecording && (
                <p className="text-sm text-gray-500">
                    Record a voice note up to {maxDuration} seconds
                </p>
            )}
        </div>
    );
}
