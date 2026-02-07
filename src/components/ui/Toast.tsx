import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'white',
                    color: '#1f2937',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                },
                success: {
                    iconTheme: {
                        primary: '#10b981',
                        secondary: 'white',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}
