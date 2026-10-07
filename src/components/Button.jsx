import React from 'react';
import { cn } from '../lib/cn';

const VARIANTS = {
    primary: 'bg-primary text-background-dark shadow-glow active:bg-primary/90',
    ghost: 'bg-white/[0.06] text-white ring-1 ring-inset ring-white/10 active:bg-white/10',
    danger: 'bg-red-500/10 text-danger ring-1 ring-inset ring-red-400/40 active:bg-red-500/20',
    soft: 'bg-primary/15 text-primary ring-1 ring-inset ring-primary/25 active:bg-primary/25',
};

export default function Button({ variant = 'primary', className, children, ...props }) {
    return (
        <button
            className={cn(
                'flex h-12 items-center justify-center gap-2 rounded-2xl px-4 text-base font-bold transition-[transform,background-color,opacity] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
                VARIANTS[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
