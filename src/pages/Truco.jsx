import React, { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, RotateCcw, Undo2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import IconButton from '../components/IconButton';
import AnimatedNumber from '../components/AnimatedNumber';
import MatchBox from '../components/MatchBox';
import ConfirmationModal from '../components/ConfirmationModal';
import WinnerOverlay from '../components/WinnerOverlay';
import Toast from '../components/Toast';
import Button from '../components/Button';
import { STORAGE_KEYS, usePersistentState } from '../lib/storage';
import { feedback } from '../lib/feedback';
import { useWakeLock } from '../lib/useWakeLock';
import { cn } from '../lib/cn';

const QUICK_POINTS = [2, 3, 4];

const initialGame = () => ({
    us: 0,
    them: 0,
    nameUs: 'Nosotros',
    nameThem: 'Ellos',
    limit: 30, // 15 or 30
    history: [], // [{ team, delta }] para deshacer
});

// Cajas de 5 fósforos: a 30 se dividen en malas (0-15) y buenas (16-30)
function boxesFor(score, count) {
    return Array.from({ length: count }, (_, i) => Math.max(0, Math.min(5, score - i * 5)));
}

function SectionLabel({ active, children }) {
    return (
        <span
            className={cn(
                'text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300',
                active ? 'text-primary' : 'text-white/25'
            )}
        >
            {children}
        </span>
    );
}

function TeamColumn({ name, score, limit, leading, isWinner, locked, onAdd, onSubtract, onNameChange }) {
    const split = limit === 30;
    const inBuenas = split && score > 15;

    return (
        <section className={cn('relative flex min-h-0 flex-col transition-colors duration-500', isWinner && 'bg-gold/[0.06]')}>
            {/* Nombre y puntaje */}
            <div className="flex shrink-0 flex-col items-center px-3 pt-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    maxLength={14}
                    aria-label="Nombre del equipo"
                    className="w-full rounded-lg bg-transparent py-0.5 text-center text-base font-bold uppercase tracking-wider text-white/80 outline-none transition focus:bg-white/5 focus:text-white"
                />
                <AnimatedNumber
                    value={score}
                    className={cn(
                        'text-6xl font-extrabold leading-none tracking-tight tabular transition-colors',
                        isWinner ? 'text-gold' : leading ? 'text-primary' : 'text-white'
                    )}
                />
                <span className="mt-1 text-xs font-medium text-white/40">
                    {isWinner ? '¡Ganaron!' : `Faltan ${limit - score}`}
                </span>
            </div>

            {/* Tablero: tocar suma 1 punto */}
            <motion.button
                onClick={() => onAdd(1)}
                disabled={locked}
                whileTap={{ scale: 0.985, backgroundColor: 'rgba(255,255,255,0.03)' }}
                aria-label={`Sumar un punto a ${name}`}
                className="mx-2 my-2 flex min-h-0 flex-1 flex-col rounded-3xl py-1"
            >
                {split && (
                    <div className="flex shrink-0 justify-center pt-1">
                        <SectionLabel active={!inBuenas}>Malas</SectionLabel>
                    </div>
                )}
                <div className="flex min-h-0 flex-1 flex-col">
                    {boxesFor(score, 3).map((v, i) => (
                        <div key={`m-${i}`} className="flex min-h-0 flex-1 items-center justify-center p-0.5">
                            <MatchBox value={v} />
                        </div>
                    ))}
                </div>
                {split && (
                    <>
                        <div className="mx-4 my-1 flex shrink-0 items-center gap-2">
                            <span className="h-px flex-1 bg-white/15" />
                            <SectionLabel active={inBuenas}>Buenas</SectionLabel>
                            <span className="h-px flex-1 bg-white/15" />
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col">
                            {boxesFor(score - 15, 3).map((v, i) => (
                                <div key={`b-${i}`} className="flex min-h-0 flex-1 items-center justify-center p-0.5">
                                    <MatchBox value={v} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </motion.button>

            {/* Controles */}
            <div className="shrink-0 space-y-2 px-3 pb-3">
                <div className="flex gap-2">
                    <button
                        onClick={onSubtract}
                        disabled={score === 0}
                        aria-label={`Restar un punto a ${name}`}
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-white ring-1 ring-inset ring-white/10 transition active:scale-90 active:bg-white/10 disabled:opacity-30"
                    >
                        <Minus size={22} />
                    </button>
                    <button
                        onClick={() => onAdd(1)}
                        disabled={locked}
                        aria-label={`Sumar un punto a ${name}`}
                        className="flex h-12 flex-1 items-center justify-center gap-1 rounded-2xl bg-primary text-lg font-extrabold text-background-dark shadow-glow transition active:scale-95 disabled:opacity-40 disabled:shadow-none"
                    >
                        <Plus size={22} strokeWidth={2.75} />1
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {QUICK_POINTS.map((pts) => (
                        <button
                            key={pts}
                            onClick={() => onAdd(pts)}
                            disabled={locked}
                            className="h-10 rounded-xl bg-primary/10 text-[15px] font-bold text-primary ring-1 ring-inset ring-primary/20 transition active:scale-90 active:bg-primary/20 disabled:opacity-30"
                        >
                            +{pts}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Truco() {
    useWakeLock();
    const [game, setGame] = usePersistentState(STORAGE_KEYS.truco, initialGame);
    const { us, them, nameUs, nameThem, limit } = game;
    const history = game.history ?? [];

    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [dismissedWin, setDismissedWin] = useState(false);
    const [toast, setToast] = useState(null);
    const dismissToast = useCallback(() => setToast(null), []);

    const winner = us >= limit ? 'us' : them >= limit ? 'them' : null;

    const handleAdd = (team, points) => {
        if (winner) return;
        const current = game[team];
        const next = Math.min(current + points, limit);
        const delta = next - current;
        if (delta === 0) return;

        setGame((g) => ({ ...g, [team]: next, history: [...(g.history ?? []), { team, delta }] }));
        feedback('score');

        const name = team === 'us' ? nameUs : nameThem;
        if (limit === 30 && current <= 15 && next > 15 && next < limit) {
            setToast({ id: Date.now(), message: `${name}: ¡a las buenas!` });
        }
    };

    const handleSubtract = (team) => {
        if (game[team] === 0) return;
        setGame((g) => ({ ...g, [team]: g[team] - 1, history: [...(g.history ?? []), { team, delta: -1 }] }));
        setDismissedWin(false);
        feedback('undo');
    };

    const undo = () => {
        const last = history[history.length - 1];
        if (!last) return;
        setGame((g) => ({
            ...g,
            [last.team]: Math.max(0, Math.min(g.limit, g[last.team] - last.delta)),
            history: g.history.slice(0, -1),
        }));
        setDismissedWin(false);
        feedback('undo');
    };

    const resetGame = () => {
        setGame((g) => ({ ...g, us: 0, them: 0, history: [] }));
        setDismissedWin(false);
    };

    const toggleLimit = () => {
        setGame((g) => ({ ...g, limit: g.limit === 30 ? 15 : 30, us: 0, them: 0, history: [] }));
        setDismissedWin(false);
        feedback('tap');
    };

    const winnerName = winner === 'us' ? nameUs : nameThem;

    return (
        <div className="flex h-[100dvh] flex-col overflow-hidden">
            <AppHeader
                title="Truco"
                subtitle={limit === 30 ? 'A 30 · malas y buenas' : 'A 15 puntos'}
                actions={
                    <>
                        <button
                            onClick={() => (us + them > 0 ? setIsLimitModalOpen(true) : toggleLimit())}
                            className="mr-1 h-8 rounded-full bg-white/[0.07] px-3 text-xs font-bold text-white/80 ring-1 ring-inset ring-white/10 transition active:scale-95"
                            aria-label="Cambiar puntaje de la partida"
                        >
                            A {limit}
                        </button>
                        <IconButton label="Deshacer" onClick={undo} disabled={history.length === 0}>
                            <Undo2 size={20} />
                        </IconButton>
                        <IconButton label="Nueva partida" onClick={() => setIsRestartModalOpen(true)}>
                            <RotateCcw size={20} />
                        </IconButton>
                    </>
                }
            />

            <main className="relative grid min-h-0 flex-1 grid-cols-2 pb-safe">
                <div className="pointer-events-none absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <TeamColumn
                    name={nameUs}
                    score={us}
                    limit={limit}
                    leading={us > them}
                    isWinner={winner === 'us'}
                    locked={!!winner}
                    onAdd={(pts) => handleAdd('us', pts)}
                    onSubtract={() => handleSubtract('us')}
                    onNameChange={(v) => setGame((g) => ({ ...g, nameUs: v }))}
                />
                <TeamColumn
                    name={nameThem}
                    score={them}
                    limit={limit}
                    leading={them > us}
                    isWinner={winner === 'them'}
                    locked={!!winner}
                    onAdd={(pts) => handleAdd('them', pts)}
                    onSubtract={() => handleSubtract('them')}
                    onNameChange={(v) => setGame((g) => ({ ...g, nameThem: v }))}
                />
            </main>

            <Toast toast={toast} onDismiss={dismissToast} duration={2200} bottom="calc(env(safe-area-inset-bottom) + 8.5rem)" />

            <ConfirmationModal
                isOpen={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                onConfirm={resetGame}
                title="¿Empezar partida nueva?"
                message="El tanteador vuelve a cero. Los nombres se mantienen."
                confirmLabel="Nueva partida"
            />

            <ConfirmationModal
                isOpen={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
                onConfirm={toggleLimit}
                title={`¿Jugar a ${limit === 30 ? 15 : 30}?`}
                message="Cambiar el puntaje reinicia el tanteador actual."
                confirmLabel={`Jugar a ${limit === 30 ? 15 : 30}`}
            />

            <WinnerOverlay
                open={!!winner && !dismissedWin}
                title={`¡Ganaron ${winnerName}!`}
                subtitle={`${Math.max(us, them)} a ${Math.min(us, them)}`}
                actions={
                    <>
                        <Button onClick={resetGame}>Nueva partida</Button>
                        <Button variant="ghost" onClick={() => setDismissedWin(true)}>Ver tanteador</Button>
                    </>
                }
            />
        </div>
    );
}
