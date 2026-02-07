interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'white' | 'rose';
}

export function LoadingSpinner({ size = 'md', variant = 'rose' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClasses[size]} ${variant === 'rose' ? 'spinner-rose' : 'spinner'}`}
                style={{
                    borderWidth: size === 'sm' ? '2px' : '3px',
                }}
            />
        </div>
    );
}

export function HeartSpinner() {
    return (
        <div className="flex items-center justify-center">
            <span className="heart-spinner">💕</span>
        </div>
    );
}

export function FullPageLoader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gradient-bg-soft">
            <HeartSpinner />
            <p className="mt-4 text-rose-600 font-medium animate-pulse">Loading...</p>
        </div>
    );
}
