import { useState, useEffect, useRef } from 'react';
import { searchMusic } from '../lib/api';
import type { MusicTrack } from '../types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Orbit01Icon, Search01Icon } from '@hugeicons/core-free-icons';

interface MusicSearchProps {
    onSelect: (track: MusicTrack) => void;
    selectedTrack: MusicTrack | null;
}

export function MusicSearch({ onSelect, selectedTrack }: MusicSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MusicTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length < 2) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await searchMusic(query, 8);
                console.log('Music search response:', response);

                // Backend returns { success, data: { query, count, tracks } }
                const tracks = response.data?.tracks || [];
                console.log('Tracks found:', tracks.length, tracks);

                setResults(tracks);
                setIsOpen(true);
            } catch (err) {
                console.error('Music search error:', err);
                if (err instanceof TypeError && err.message.includes('fetch')) {
                    setError('Cannot connect to server. Make sure the backend is running.');
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to search. Please try again.');
                }
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelect = (track: MusicTrack) => {
        onSelect(track);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            {selectedTrack ? (
                <div className="track-card selected">
                    <img
                        src={selectedTrack.thumbnailUrl}
                        alt={selectedTrack.title}
                        className="track-thumbnail"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{selectedTrack.title}</p>
                        <p className="text-sm text-gray-500 truncate">{selectedTrack.artist}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                        {formatDuration(selectedTrack.duration)}
                    </span>
                    <button
                        onClick={() => onSelect(null as unknown as MusicTrack)}
                        className="p-1.5 hover:bg-rose-100 rounded-full text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => results.length > 0 && setIsOpen(true)}
                            placeholder="Search for a song..."
                            className="input-field pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {isLoading ? 
                                <HugeiconsIcon
                                    icon={Orbit01Icon}
                                    size={24}
                                    color="currentColor"
                                    strokeWidth={1.5}
                                    className='animate-spin'
                                /> 
                            : 
                                <HugeiconsIcon
                                    icon={Search01Icon}
                                    size={24}
                                    color="currentColor"
                                    strokeWidth={1.5}
                                />
                            }
                        </span>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 mt-2">{error}</p>
                    )}

                    {isOpen && results.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
                            {results.map((track) => (
                                <div
                                    key={track.trackId}
                                    onClick={() => handleSelect(track)}
                                    className="track-card hover:bg-rose-50 border-b border-gray-100 last:border-b-0"
                                >
                                    <img
                                        src={track.thumbnailUrl}
                                        alt={track.title}
                                        className="track-thumbnail"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{track.title}</p>
                                        <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {formatDuration(track.duration)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {isOpen && query.length >= 2 && !isLoading && results.length === 0 && !error && (
                        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center text-gray-500">
                            No results found for "{query}"
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
