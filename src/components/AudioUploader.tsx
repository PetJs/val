import { useState, useRef, useCallback } from 'react';

interface AudioUploaderProps {
    onFileSelect: (file: File) => void;
    maxSizeMB?: number;
    acceptedTypes?: string[];
}

export function AudioUploader({
    onFileSelect,
    maxSizeMB = 5,
}: AudioUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const maxBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxBytes) {
            return `File too large. Maximum size is ${maxSizeMB}MB`;
        }

        // Check file extension as fallback
        const extension = file.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['mp3', 'wav', 'webm', 'ogg'];

        if (!validExtensions.includes(extension || '')) {
            return 'Invalid file type. Accepted: MP3, WAV, WebM, OGG';
        }

        return null;
    };

    const handleFile = useCallback((file: File) => {
        const validationError = validateFile(file);

        if (validationError) {
            setError(validationError);
            setSelectedFile(null);
            return;
        }

        setError(null);
        setSelectedFile(file);
        onFileSelect(file);
    }, [onFileSelect, maxSizeMB]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-300 hover:border-rose-300 hover:bg-rose-50/50'
                    }
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".mp3,.wav,.webm,.ogg,audio/*"
                    onChange={handleInputChange}
                    className="hidden"
                />

                {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">🎵</span>
                        <div className="text-left">
                            <p className="font-medium text-gray-800">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        <span className="text-4xl mb-2 block">📁</span>
                        <p className="text-gray-600">
                            <span className="text-rose-500 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            MP3, WAV, WebM, OGG (max {maxSizeMB}MB)
                        </p>
                    </>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
