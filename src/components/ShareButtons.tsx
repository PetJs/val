import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { CopyLinkIcon } from '@hugeicons/core-free-icons';

interface ShareButtonsProps {
    link: string;
    valName: string;
}

export function ShareButtons({ link}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    // const handleWhatsAppShare = () => {
    //     const message = encodeURIComponent(
    //         `Hey ${valName}! 💕 Someone special has sent you a Valentine's invite! Click here to see it: ${link}`
    //     );
    //     window.open(`https://wa.me/?text=${message}`, '_blank');
    // };

    return (
        <div className="space-y-4">
            {/* Link Display */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={link}
                    readOnly
                    className="input-field bg-gray-50 text-gray-600 flex-1"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                    variant={copied ? 'success' : 'secondary'}
                    onClick={handleCopy}
                >
                    {copied ? '✓ Copied!' 
                    :   
                        <HugeiconsIcon
                            icon={CopyLinkIcon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    }
                </Button>
            </div>

            {/* Share Buttons
            <div className="flex gap-3">
                <Button
                    variant="primary"
                    onClick={handleWhatsAppShare}
                    className="flex-1 bg-[#25D366] hover:bg-[#20BD5A]"
                    style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)'
                    }}
                >
                    <span className="text-xl">📱</span>
                    Share on WhatsApp
                </Button>
            </div> */}

            <p className="text-sm text-gray-500 text-center">
                Share this link with your Valentine to reveal your message!
            </p>
        </div>
    );
}
