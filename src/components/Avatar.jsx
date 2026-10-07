import React from 'react';
import { avatarColor, initials } from '../lib/players';
import { cn } from '../lib/cn';

export default function Avatar({ name, index, size = 32, className }) {
    const color = avatarColor(index);
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ring-1',
                color.bg,
                color.text,
                color.ring,
                className
            )}
            style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
            aria-hidden="true"
        >
            {initials(name)}
        </span>
    );
}
