import React from 'react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    confirmVariant?: 'primary' | 'danger' | 'success';
    isLoading?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    confirmLabel,
    cancelLabel = 'Cancel',
    onConfirm,
    confirmVariant = 'primary',
    isLoading = false,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay love-ya-like-a-sister-regular" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>

                <div className="text-gray-600 mb-6">
                    {children}
                </div>

                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelLabel}
                    </Button>

                    {onConfirm && confirmLabel && (
                        <Button
                            variant={confirmVariant}
                            onClick={onConfirm}
                            isLoading={isLoading}
                        >
                            {confirmLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
