import React from 'react';

// Fondo de paño verde con luz cenital y viñeta
export default function Felt({ id }) {
    return (
        <>
            <defs>
                <radialGradient id={`${id}-light`} cx="50%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#24502f" />
                    <stop offset="55%" stopColor="#14301d" />
                    <stop offset="100%" stopColor="#0a170e" />
                </radialGradient>
                <filter id={`${id}-noise`} x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
                </filter>
            </defs>
            <rect width="400" height="200" fill={`url(#${id}-light)`} />
            <rect width="400" height="200" filter={`url(#${id}-noise)`} />
        </>
    );
}
