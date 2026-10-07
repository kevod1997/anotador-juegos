import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, X } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from './Button';
import Avatar from './Avatar';
import { newId } from '../lib/players';
import { cn } from '../lib/cn';

const MAX_SUGGESTIONS = 10;

const StepButton = ({ label, disabled, onClick, children }) => (
    <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className="flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white ring-1 ring-inset ring-white/10 transition active:scale-90 active:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
    >
        {children}
    </button>
);

// Hoja para armar la partida: cantidad de jugadores y sus nombres.
// Arranca sin nombres y ofrece los demás nombres guardados como atajos.
export default function PlayerSetup({ open, subtitle, min = 1, max, defaultCount = 2, roster, onConfirm, onCancel }) {
    const [slots, setSlots] = useState([]); // [{ id, name }]
    const inputs = useRef({});
    const focusNext = useRef(null);

    // Se arma una sola vez por apertura con lo que haya guardado en ese momento
    useEffect(() => {
        if (!open) return;
        // Siempre arranca vacío: los nombres guardados se eligen desde los atajos
        const count = Math.min(max, Math.max(min, defaultCount));
        const initial = Array.from({ length: count }, () => ({ id: newId(), name: '' }));
        setSlots(initial);

        const t = setTimeout(() => inputs.current[initial[0].id]?.focus(), 300);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!focusNext.current) return;
        inputs.current[focusNext.current]?.focus();
        focusNext.current = null;
    }, [slots]);

    const setName = (id, name) => setSlots((s) => s.map((slot) => (slot.id === id ? { ...slot, name } : slot)));

    const addSlot = (name = '') => {
        const slot = { id: newId(), name };
        if (!name) focusNext.current = slot.id;
        setSlots((s) => (s.length >= max ? s : [...s, slot]));
    };

    const removeSlot = (id) => setSlots((s) => (s.length <= min ? s : s.filter((slot) => slot.id !== id)));

    const pickSuggestion = (name) => {
        const empty = slots.find((s) => !s.name.trim());
        if (empty) setName(empty.id, name);
        else addSlot(name);
    };

    const used = new Set(slots.map((s) => s.name.trim().toLowerCase()));
    const suggestions = roster.names.filter((n) => !used.has(n.toLowerCase())).slice(0, MAX_SUGGESTIONS);
    const canPick = slots.length < max || slots.some((s) => !s.name.trim());

    const submit = (e) => {
        e.preventDefault();
        const typed = slots.map((s) => s.name.trim());
        roster.rememberLineup(typed);
        onConfirm(typed.map((name, i) => name || `Jugador ${i + 1}`));
    };

    const onKeyDown = (e, index) => {
        if (e.key !== 'Enter' || index === slots.length - 1) return; // el último envía el formulario
        e.preventDefault();
        inputs.current[slots[index + 1].id]?.focus();
    };

    return (
        <BottomSheet open={open} dismissible={false} title="¿Quiénes juegan?" subtitle={subtitle}>
            <form onSubmit={submit}>
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/45">Jugadores</span>
                    <div className="flex items-center gap-3">
                        <StepButton label="Menos jugadores" disabled={slots.length <= min} onClick={() => removeSlot(slots[slots.length - 1].id)}>
                            <Minus size={18} />
                        </StepButton>
                        <span className="w-6 text-center text-xl font-extrabold tabular" aria-live="polite">
                            {slots.length}
                        </span>
                        <StepButton label="Más jugadores" disabled={slots.length >= max} onClick={() => addSlot()}>
                            <Plus size={18} />
                        </StepButton>
                    </div>
                </div>

                <ul className="no-scrollbar mb-4 max-h-[36dvh] space-y-2 overflow-y-auto overscroll-contain">
                    <AnimatePresence initial={false}>
                        {slots.map((slot, i) => (
                            <motion.li
                                key={slot.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                className="flex items-center gap-3"
                            >
                                <Avatar name={slot.name || `Jugador ${i + 1}`} index={i} size={40} />
                                <input
                                    ref={(el) => {
                                        if (el) inputs.current[slot.id] = el;
                                        else delete inputs.current[slot.id];
                                    }}
                                    value={slot.name}
                                    onChange={(e) => setName(slot.id, e.target.value)}
                                    onKeyDown={(e) => onKeyDown(e, i)}
                                    maxLength={20}
                                    autoComplete="off"
                                    enterKeyHint={i === slots.length - 1 ? 'done' : 'next'}
                                    aria-label={`Nombre del jugador ${i + 1}`}
                                    placeholder={`Jugador ${i + 1}`}
                                    className="h-12 min-w-0 flex-1 rounded-2xl border-0 bg-white/[0.06] px-4 text-base font-semibold text-white ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    aria-label={`Quitar jugador ${i + 1}`}
                                    disabled={slots.length <= min}
                                    onClick={() => removeSlot(slot.id)}
                                    className={cn(
                                        'flex size-9 shrink-0 items-center justify-center rounded-full text-white/40 transition active:scale-90 active:bg-white/10',
                                        slots.length <= min && 'invisible'
                                    )}
                                >
                                    <X size={18} />
                                </button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>

                {suggestions.length > 0 && (
                    <div className="mb-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/45">Guardados</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    disabled={!canPick}
                                    onClick={() => pickSuggestion(name)}
                                    className="h-9 max-w-[10rem] truncate rounded-full bg-primary/10 px-3.5 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 transition active:scale-95 active:bg-primary/20 disabled:opacity-40"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-[1fr_1.8fr] gap-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Volver
                    </Button>
                    <Button type="submit">Empezar</Button>
                </div>
            </form>
        </BottomSheet>
    );
}
