import { useState, useEffect } from 'react';

interface TimeRangeSelectorProps {
    maxDuration: number; // in seconds
    startTime: number;
    endTime: number;
    onStartChange: (seconds: number) => void;
    onEndChange: (seconds: number) => void;
    maxClipDuration?: number;
}

export function TimeRangeSelector({
    maxDuration,
    startTime,
    endTime,
    onStartChange,
    onEndChange,
    maxClipDuration = 30,
}: TimeRangeSelectorProps) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const clipDuration = endTime - startTime;

        if (endTime <= startTime) {
            setError('End time must be after start time');
        } else if (clipDuration > maxClipDuration) {
            setError(`Clip duration cannot exceed ${maxClipDuration} seconds`);
        } else if (endTime > maxDuration) {
            setError('End time exceeds track duration');
        } else {
            setError(null);
        }
    }, [startTime, endTime, maxDuration, maxClipDuration]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartChange = (value: string) => {
        const seconds = parseInt(value) || 0;
        onStartChange(Math.max(0, Math.min(seconds, maxDuration)));
    };

    const handleEndChange = (value: string) => {
        const seconds = parseInt(value) || 0;
        onEndChange(Math.max(0, Math.min(seconds, maxDuration)));
    };

    const clipDuration = endTime - startTime;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Start:</label>
                    <input
                        type="number"
                        min={0}
                        max={maxDuration}
                        value={startTime}
                        onChange={(e) => handleStartChange(e.target.value)}
                        className="time-input"
                    />
                    <span className="text-sm text-gray-400">sec</span>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">End:</label>
                    <input
                        type="number"
                        min={0}
                        max={maxDuration}
                        value={endTime}
                        onChange={(e) => handleEndChange(e.target.value)}
                        className="time-input"
                    />
                    <span className="text-sm text-gray-400">sec</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className={`font-medium ${clipDuration > maxClipDuration ? 'text-red-500' : 'text-rose-600'}`}>
                        {formatTime(Math.abs(clipDuration))}
                    </span>
                </div>
            </div>

            {/* Visual Timeline */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`absolute h-full transition-all ${error ? 'bg-red-400' : 'bg-gradient-to-r from-rose-400 to-pink-500'}`}
                    style={{
                        left: `${(startTime / maxDuration) * 100}%`,
                        width: `${((endTime - startTime) / maxDuration) * 100}%`,
                    }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-400">
                <span>0:00</span>
                <span>{formatTime(maxDuration)}</span>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <p className="text-xs text-gray-500">
                Select up to {maxClipDuration} seconds of the track
            </p>
        </div>
    );
}
