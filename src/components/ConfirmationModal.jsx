import React from 'react';
import BottomSheet from './BottomSheet';
import Button from './Button';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    tone = 'danger',
}) {
    return (
        <BottomSheet open={isOpen} onClose={onClose} title={title}>
            <p className="mb-6 text-[15px] leading-relaxed text-white/70">{message}</p>
            <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button
                    variant={tone === 'danger' ? 'danger' : 'primary'}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    {confirmLabel}
                </Button>
            </div>
        </BottomSheet>
    );
}
