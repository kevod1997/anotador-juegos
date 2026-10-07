import React from 'react';

const L = 7, C = 12, R = 17;
export const PIPS = {
    1: [[C, C]],
    2: [[L, L], [R, R]],
    3: [[L, L], [C, C], [R, R]],
    4: [[L, L], [R, L], [L, R], [R, R]],
    5: [[L, L], [R, L], [C, C], [L, R], [R, R]],
    6: [[L, L], [R, L], [L, C], [R, C], [L, R], [R, R]],
};

export default function DiceFace({ value, size = 22, className = '', title }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={className}
            role="img"
            aria-label={title ?? `Dado ${value}`}
        >
            <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
            {PIPS[value]?.map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" />
            ))}
        </svg>
    );
}
