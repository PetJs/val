import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    multiline?: boolean;
    rows?: number;
}

export function InputField({
    label,
    error,
    multiline = false,
    rows = 4,
    className = '',
    id,
    ...props
}: InputFieldProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-2">
            <label
                htmlFor={inputId}
                className="block text-sm font-semibold text-gray-700"
            >
                {label}
            </label>

            {multiline ? (
                <textarea
                    id={inputId}
                    rows={rows}
                    className={`input-field ${error ? 'error' : ''} ${className}`}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            ) : (
                <input
                    id={inputId}
                    className={`input-field ${error ? 'error' : ''} ${className}`}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
