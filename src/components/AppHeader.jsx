import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../lib/cn';

// Barra superior translúcida con soporte para notch
export default function AppHeader({ title, subtitle, back = '/', actions, className }) {
    return (
        <header className={cn('glass sticky top-0 z-30 shrink-0 border-b border-line pt-safe', className)}>
            <div className="flex h-14 items-center gap-1 px-2">
                {back ? (
                    <Link
                        to={back}
                        aria-label="Volver"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/90 transition active:scale-90 active:bg-white/10"
                    >
                        <ChevronLeft size={26} strokeWidth={2.25} />
                    </Link>
                ) : (
                    <div className="w-2" />
                )}
                <div className="min-w-0 flex-1 px-1">
                    <h1 className="truncate text-[17px] font-bold leading-tight tracking-tight">{title}</h1>
                    {subtitle && <p className="truncate text-xs font-medium text-white/50">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-0.5">{actions}</div>
            </div>
        </header>
    );
}
