import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-background-light dark:bg-background-dark p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
                <h3 className="mb-2 text-xl font-bold text-black dark:text-white">{title}</h3>
                <p className="mb-6 text-neutral-600 dark:text-neutral-300">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
