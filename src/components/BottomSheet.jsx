import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

// Hoja inferior: se abre desde abajo (alcance del pulgar) y se cierra deslizando
export default function BottomSheet({ open, onClose, title, subtitle, icon, children, className }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div key="sheet" className="fixed inset-0 z-50 flex items-end justify-center">
                    <motion.div
                        className="absolute inset-0 bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={typeof title === 'string' ? title : undefined}
                        className={cn(
                            'relative w-full max-w-lg rounded-t-[28px] border-t border-white/10 bg-surface shadow-sheet pb-safe-4',
                            className
                        )}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 34, stiffness: 380 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.7 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 90 || info.velocity.y > 500) onClose?.();
                        }}
                    >
                        <div className="flex justify-center pb-1 pt-3">
                            <div className="h-1.5 w-10 rounded-full bg-white/20" />
                        </div>
                        {title && (
                            <header className="flex items-center gap-3 px-5 pb-4 pt-2">
                                {icon}
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-lg font-bold leading-tight">{title}</h3>
                                    {subtitle && <p className="truncate text-sm text-white/55">{subtitle}</p>}
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Cerrar"
                                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/70 transition active:scale-90 active:bg-white/10"
                                >
                                    <X size={18} />
                                </button>
                            </header>
                        )}
                        <div className="px-5">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
