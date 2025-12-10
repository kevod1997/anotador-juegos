import React from 'react';

export default function ScoreSelector({ isOpen, onClose, onSelect, options, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-background-light dark:bg-zinc-900 p-6 shadow-xl ring-1 ring-white/10 animate-in zoom-in-95">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black dark:text-white">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined text-black dark:text-white">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Tachar Option */}
                    <button
                        onClick={() => onSelect(0)} // 0 represents crossed out (Tachar)
                        className="col-span-2 flex h-12 items-center justify-center rounded-xl border-2 border-red-500/50 bg-transparent text-base font-bold text-red-500 hover:bg-red-500/10"
                    >
                        Tachar (0)
                    </button>

                    {/* Numeric Options */}
                    {options && options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onSelect(opt)}
                            className="flex h-12 items-center justify-center rounded-xl bg-primary/20 hover:bg-primary/30 text-base font-bold text-primary transition-colors"
                        >
                            {opt === 'GANA' ? 'GANA' : opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
