import React from 'react';
import { cn } from '../lib/cn';

export default function IconButton({ label, className, children, ...props }) {
    return (
        <button
            aria-label={label}
            title={label}
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full text-white/80 transition-[transform,background-color,opacity] duration-150 active:scale-90 active:bg-white/10 disabled:opacity-30',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
