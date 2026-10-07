import React from 'react';
import { PIPS } from '../DiceFace';

// Dado "3D" simple: cara + canto inferior + sombra sobre el paño
export default function Die({ x, y, size = 64, rotate = 0, value = 6, pip = '#102216', face = '#f6f3ea', side = '#c9c2b0', accentPip }) {
    const s = size / 24;
    return (
        <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
            <ellipse cx="0" cy={size * 0.56} rx={size * 0.55} ry={size * 0.12} fill="#000" opacity="0.35" />
            <rect x={-size / 2} y={-size / 2 + size * 0.08} width={size} height={size} rx={size * 0.22} fill={side} />
            <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.22} fill={face} />
            <rect x={-size / 2} y={-size / 2} width={size} height={size * 0.5} rx={size * 0.22} fill="#fff" opacity="0.35" />
            {PIPS[value].map(([cx, cy], i) => (
                <circle
                    key={i}
                    cx={(cx - 12) * s}
                    cy={(cy - 12) * s}
                    r={2.1 * s}
                    fill={value === 1 && accentPip ? accentPip : pip}
                />
            ))}
        </g>
    );
}
