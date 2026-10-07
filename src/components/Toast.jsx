import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Undo2 } from 'lucide-react';

// Aviso flotante con acción de "Deshacer". toast = { id, message, onUndo }
export default function Toast({ toast, onDismiss, duration = 4000, bottom = 'calc(env(safe-area-inset-bottom) + 1rem)' }) {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onDismiss, duration);
        return () => clearTimeout(t);
    }, [toast, onDismiss, duration]);

    return createPortal(
        <div className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4" style={{ bottom }}>
            <AnimatePresence mode="popLayout">
                {toast && (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-ink/95 py-2 pl-4 pr-2 shadow-sheet backdrop-blur"
                    >
                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-white/90">{toast.message}</p>
                        {toast.onUndo && (
                            <button
                                onClick={() => {
                                    toast.onUndo();
                                    onDismiss();
                                }}
                                className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-primary transition active:scale-95 active:bg-primary/10"
                            >
                                <Undo2 size={16} />
                                Deshacer
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>,
        document.body
    );
}
