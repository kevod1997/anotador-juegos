import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Cuadro de 5 fósforos: izquierda, arriba, derecha, abajo y diagonal (cada uno con su cabeza)
const STICKS = [
    { d: 'M 8 50 L 8 14', head: [8, 10.5] },
    { d: 'M 12 8 L 46 8', head: [49.5, 8] },
    { d: 'M 52 12 L 52 46', head: [52, 49.5] },
    { d: 'M 48 52 L 14 52', head: [10.5, 52] },
    { d: 'M 15 15 L 43 43', head: [45.5, 45.5] },
];

function Stick({ d, head }) {
    return (
        <motion.g exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
            {/* Sombra / canto del palito */}
            <motion.path
                d={d}
                stroke="#9a5b23"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
            />
            <motion.path
                d={d}
                stroke="#FDBA74"
                strokeWidth="3.6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
            />
            <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.18, type: 'spring', stiffness: 600, damping: 18 }}
            >
                <circle cx={head[0]} cy={head[1]} r="4.2" fill="#b91c1c" />
                <circle cx={head[0] - 1.2} cy={head[1] - 1.2} r="1.3" fill="#fca5a5" opacity="0.8" />
            </motion.g>
        </motion.g>
    );
}

export default function MatchBox({ value }) {
    return (
        <svg viewBox="0 0 60 60" className="aspect-square h-full max-h-[76px] overflow-visible" aria-hidden="true">
            <rect x="8" y="8" width="44" height="44" rx="3" fill="none" stroke="white" strokeOpacity="0.06" strokeDasharray="3 4" />
            <AnimatePresence>
                {STICKS.slice(0, value).map((stick, i) => (
                    <Stick key={i} {...stick} />
                ))}
            </AnimatePresence>
        </svg>
    );
}
