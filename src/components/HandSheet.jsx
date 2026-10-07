import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Delete, Trash2 } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from './Button';
import Avatar from './Avatar';
import { feedback } from '../lib/feedback';
import { cn } from '../lib/cn';

const MAX_DIGITS = 3;
// Únicas restas permitidas (bajar cartas de golpe)
const NEGATIVES = ['-5', '-10'];

function Key({ label, onClick, className, children }) {
    return (
        <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            aria-label={label}
            onClick={onClick}
            className={cn(
                'flex h-[52px] items-center justify-center rounded-2xl bg-white/[0.06] text-2xl font-bold text-white ring-1 ring-inset ring-white/10 transition-colors tabular active:bg-white/10',
                className
            )}
        >
            {children}
        </motion.button>
    );
}

// Hoja para anotar (o corregir) los puntos de una mano con un teclado numérico propio.
// players: en orden de repartida. initial: { [playerId]: number } al editar una mano ya anotada.
// optional: ids que pueden quedar vacíos (jugadores que se sumaron después de esa mano).
export default function HandSheet({ open, title, subtitle, players, initial, optional = [], onSave, onClose, onDelete }) {
    const [values, setValues] = useState({});
    const [activeId, setActiveId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!open) return;
        const start = Object.fromEntries(players.map((p) => [p.id, initial?.[p.id] !== undefined ? String(initial[p.id]) : '']));
        setValues(start);
        setActiveId((players.find((p) => start[p.id] === '') ?? players[0])?.id ?? null);
        setConfirmDelete(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const missing = players.filter((p) => values[p.id] === '' && !optional.includes(p.id)).length;
    const activeIndex = players.findIndex((p) => p.id === activeId);

    const type = (digit) => {
        if (!activeId) return;
        setValues((v) => {
            const current = v[activeId] ?? '';
            const next = current === '0' || current.startsWith('-') ? digit : current + digit;
            return next.length > MAX_DIGITS ? v : { ...v, [activeId]: next };
        });
        feedback('tap');
    };

    const setNegative = (value) => {
        if (!activeId) return;
        setValues((v) => ({ ...v, [activeId]: v[activeId] === value ? '' : value }));
        feedback('tap');
    };

    const erase = () => {
        if (!activeId) return;
        setValues((v) => ({ ...v, [activeId]: (v[activeId] ?? '').startsWith('-') ? '' : (v[activeId] ?? '').slice(0, -1) }));
        feedback('tap');
    };

    // Pasa al siguiente jugador (primero los que faltan, en orden de la lista)
    const next = () => {
        const after = [...players.slice(activeIndex + 1), ...players.slice(0, activeIndex + 1)];
        const target = after.find((p) => values[p.id] === '' && p.id !== activeId) ?? players[(activeIndex + 1) % players.length];
        setActiveId(target.id);
        feedback('tap');
    };

    const save = () => {
        if (missing > 0) return;
        const scores = {};
        players.forEach((p) => {
            if (values[p.id] !== '') scores[p.id] = Number(values[p.id]);
        });
        onSave(scores);
    };

    return (
        <BottomSheet open={open} onClose={onClose} title={title} subtitle={subtitle}>
            <div className="no-scrollbar mb-3 grid max-h-[30dvh] grid-cols-2 gap-2 overflow-y-auto overscroll-contain">
                {players.map((player, i) => {
                    const active = player.id === activeId;
                    const value = values[player.id] ?? '';
                    return (
                        <button
                            key={player.id}
                            type="button"
                            onClick={() => setActiveId(player.id)}
                            className={cn(
                                'flex h-14 min-w-0 items-center gap-2 rounded-2xl pl-2 pr-3 text-left ring-1 ring-inset transition-colors',
                                active ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white/[0.04] ring-white/10'
                            )}
                        >
                            <Avatar name={player.name} index={player.color ?? i} size={30} />
                            <span className={cn('min-w-0 flex-1 truncate text-sm font-semibold', active ? 'text-white' : 'text-white/70')}>
                                {player.name}
                            </span>
                            <span
                                className={cn(
                                    'shrink-0 text-xl font-extrabold tabular',
                                    value === '' ? 'text-white/20' : active ? 'text-primary' : 'text-white'
                                )}
                            >
                                {value === '' ? '—' : value}
                                {active && <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse rounded-full bg-primary align-[-2px]" />}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mb-2 grid grid-cols-2 gap-2">
                {NEGATIVES.map((n) => (
                    <Key
                        key={n}
                        label={`Restar ${n.slice(1)}`}
                        onClick={() => setNegative(n)}
                        className={cn('h-11 text-xl text-red-300', values[activeId] === n && 'bg-red-500/25 ring-red-400/50')}
                    >
                        −{n.slice(1)}
                    </Key>
                ))}
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                    <Key key={d} label={d} onClick={() => type(d)}>
                        {d}
                    </Key>
                ))}
                <Key label="Borrar" onClick={erase} className="text-white/70">
                    <Delete size={22} />
                </Key>
                <Key label="0" onClick={() => type('0')}>
                    0
                </Key>
                <Key label="Siguiente jugador" onClick={next} className="bg-primary/15 text-primary ring-primary/25 active:bg-primary/25">
                    <ArrowRight size={24} />
                </Key>
            </div>

            <div className={cn('grid gap-3', onDelete ? 'grid-cols-[1fr_1.8fr]' : 'grid-cols-1')}>
                {onDelete && (
                    <Button
                        type="button"
                        variant="danger"
                        onClick={() => {
                            if (!confirmDelete) {
                                setConfirmDelete(true);
                                return;
                            }
                            onDelete();
                        }}
                    >
                        <Trash2 size={18} />
                        {confirmDelete ? '¿Seguro?' : 'Borrar'}
                    </Button>
                )}
                <Button type="button" onClick={save} disabled={missing > 0}>
                    {missing > 0 ? `${missing === 1 ? 'Falta' : 'Faltan'} ${missing}` : 'Guardar mano'}
                </Button>
            </div>
        </BottomSheet>
    );
}
