import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { feedback } from '../lib/feedback';

const COLORS = ['#2bee6c', '#facc15', '#FDBA74', '#ffffff'];

function celebrate() {
    const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 60, ticks: 220 };
    confetti({ ...base, particleCount: 90, spread: 70, startVelocity: 45, origin: { x: 0.5, y: 0.35 } });
    setTimeout(() => {
        confetti({ ...base, particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
        confetti({ ...base, particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
    }, 250);
}

export default function WinnerOverlay({ open, title, subtitle, children, actions }) {
    useEffect(() => {
        if (!open) return;
        celebrate();
        feedback('win');
    }, [open]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="winner"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        className="surface-card relative w-full max-w-sm overflow-hidden rounded-[28px] bg-surface p-6 text-center shadow-sheet"
                        initial={{ scale: 0.85, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    >
                        <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-56 rounded-full bg-gold/20 blur-3xl" />
                        <motion.div
                            className="relative mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40"
                            initial={{ rotate: -20, scale: 0.4 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }}
                        >
                            <Trophy size={40} strokeWidth={1.75} />
                        </motion.div>
                        <h2 className="relative text-2xl font-extrabold tracking-tight">{title}</h2>
                        {subtitle && <p className="relative mt-1 text-white/60">{subtitle}</p>}
                        {children && <div className="relative mt-5">{children}</div>}
                        {actions && <div className="relative mt-6 grid gap-3">{actions}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
