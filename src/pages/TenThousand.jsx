import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Delete, RotateCcw, Undo2, UserPlus } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import IconButton from '../components/IconButton';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';
import PlayerSheet from '../components/PlayerSheet';
import BottomSheet from '../components/BottomSheet';
import ConfirmationModal from '../components/ConfirmationModal';
import WinnerOverlay from '../components/WinnerOverlay';
import Toast from '../components/Toast';
import Button from '../components/Button';
import { STORAGE_KEYS, usePersistentState } from '../lib/storage';
import { feedback } from '../lib/feedback';
import { newId } from '../lib/players';
import { useWakeLock } from '../lib/useWakeLock';
import { cn } from '../lib/cn';

const GOAL = 10000;
const MAX_PLAYERS = 8;
const QUICK_POINTS = [50, 100, 150, 200, 300, 500, 1000];
const fmt = (n) => n.toLocaleString('es-AR');

const initialGame = () => ({
    players: [
        { id: newId(), name: 'Jugador 1', score: 0 },
        { id: newId(), name: 'Jugador 2', score: 0 },
        { id: newId(), name: 'Jugador 3', score: 0 },
    ],
    current: 0,
    turn: [], // tiradas sumadas en el turno actual
    history: [], // fotos del estado para deshacer
});

function PlayerRow({ player, index, active, onEdit, rowRef }) {
    const progress = Math.min(player.score / GOAL, 1);
    const won = player.score >= GOAL;
    return (
        <motion.li
            ref={rowRef}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            className={cn(
                'relative overflow-hidden rounded-2xl px-3.5 py-3 ring-1 ring-inset transition-colors duration-300',
                active ? 'bg-primary/[0.07] ring-primary/60' : 'surface-card ring-transparent',
                won && 'bg-gold/[0.08] ring-gold/50'
            )}
        >
            <div className="flex items-center gap-3">
                <button onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Editar ${player.name}`}>
                    <Avatar name={player.name} index={index} size={36} />
                    <span className="min-w-0">
                        <span className={cn('block truncate font-bold', active ? 'text-white' : 'text-white/80')}>{player.name}</span>
                        <span className="block text-xs font-medium text-white/40">
                            {won ? '¡Llegó a la meta!' : active ? 'Tirando ahora' : `Faltan ${fmt(GOAL - player.score)}`}
                        </span>
                    </span>
                </button>
                <AnimatedNumber
                    value={player.score}
                    className={cn('text-2xl font-extrabold tabular', won ? 'text-gold' : active ? 'text-primary' : 'text-white')}
                />
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                    className={cn('h-full rounded-full', won ? 'bg-gold' : 'bg-primary')}
                    initial={false}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
            </div>
        </motion.li>
    );
}

export default function TenThousand() {
    useWakeLock();
    const [game, setGame] = usePersistentState(STORAGE_KEYS.tenThousand, initialGame);
    const { players, current, turn = [], history = [] } = game;
    const currentIndex = Math.min(current, players.length - 1);
    const currentPlayer = players[currentIndex];
    const turnScore = turn.reduce((a, b) => a + b, 0);
    const winner = players.find((p) => p.score >= GOAL);

    const [editing, setEditing] = useState(null);
    const [editingOpen, setEditingOpen] = useState(false);
    const [customOpen, setCustomOpen] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
    const [dismissedWin, setDismissedWin] = useState(false);
    const [toast, setToast] = useState(null);
    const dismissToast = useCallback(() => setToast(null), []);
    const rowRefs = useRef({});

    // Mantener a la vista al jugador que tiene el turno
    useEffect(() => {
        rowRefs.current[currentPlayer?.id]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [currentPlayer?.id]);

    const snapshot = (g) => ({ players: g.players, current: g.current, turn: g.turn });
    const pushHistory = (g) => [...(g.history ?? []), snapshot(g)].slice(-30);

    const addRoll = (points) => {
        if (!points || winner) return;
        setGame((g) => ({ ...g, turn: [...(g.turn ?? []), points] }));
        feedback('tap');
    };

    const removeLastRoll = () => {
        setGame((g) => ({ ...g, turn: (g.turn ?? []).slice(0, -1) }));
        feedback('undo');
    };

    const restoreLast = () => {
        setGame((g) => {
            const last = g.history?.[g.history.length - 1];
            if (!last) return g;
            return { ...g, ...last, history: g.history.slice(0, -1) };
        });
        setDismissedWin(false);
        feedback('undo');
    };

    const handleBank = () => { // Plantarse
        if (turnScore === 0 || winner) return;
        const name = currentPlayer.name;
        const reachesGoal = currentPlayer.score + turnScore >= GOAL;
        setGame((g) => ({
            ...g,
            players: g.players.map((p, i) => (i === currentIndex ? { ...p, score: p.score + turnScore } : p)),
            current: reachesGoal ? currentIndex : (currentIndex + 1) % g.players.length,
            turn: [],
            history: pushHistory(g),
        }));
        if (!reachesGoal) {
            feedback('score');
            setToast({ id: Date.now(), message: `${name} sumó ${fmt(turnScore)}`, onUndo: restoreLast });
        }
    };

    const handleBust = () => {
        if (winner) return;
        const name = currentPlayer.name;
        const lost = turnScore;
        setGame((g) => ({
            ...g,
            current: (currentIndex + 1) % g.players.length,
            turn: [],
            history: pushHistory(g),
        }));
        feedback('bust');
        setToast({
            id: Date.now(),
            message: lost > 0 ? `${name} perdió ${fmt(lost)} puntos` : `${name} no sumó`,
            onUndo: restoreLast,
        });
    };

    const addPlayer = () => {
        if (players.length >= MAX_PLAYERS) return;
        const player = { id: newId(), name: `Jugador ${players.length + 1}`, score: 0 };
        setGame((g) => ({ ...g, players: [...g.players, player] }));
        setEditing({ ...player, index: players.length, isNew: true });
        setEditingOpen(true);
        feedback('tap');
    };

    const renamePlayer = (id, name) =>
        setGame((g) => ({ ...g, players: g.players.map((p) => (p.id === id ? { ...p, name } : p)) }));

    const removePlayer = (id) =>
        setGame((g) => {
            if (g.players.length <= 1) return g;
            const idx = g.players.findIndex((p) => p.id === id);
            const nextPlayers = g.players.filter((p) => p.id !== id);
            let nextCurrent = g.current;
            if (idx < g.current) nextCurrent -= 1;
            if (nextCurrent >= nextPlayers.length) nextCurrent = 0;
            return { ...g, players: nextPlayers, current: nextCurrent, turn: idx === g.current ? [] : g.turn, history: [] };
        });

    const restart = () => {
        setGame((g) => ({ ...g, players: g.players.map((p) => ({ ...p, score: 0 })), current: 0, turn: [], history: [] }));
        setDismissedWin(false);
    };

    const submitCustom = (e) => {
        e.preventDefault();
        const points = parseInt(customValue, 10);
        if (!isNaN(points) && points > 0) addRoll(points);
        setCustomValue('');
        setCustomOpen(false);
    };

    const ranking = [...players].map((p, i) => ({ ...p, index: i })).sort((a, b) => b.score - a.score);

    return (
        <div className="flex h-[100dvh] flex-col">
            <AppHeader
                title="El 10.000"
                subtitle={`${players.length} jugadores · meta ${fmt(GOAL)}`}
                actions={
                    <>
                        <IconButton label="Agregar jugador" onClick={addPlayer} disabled={players.length >= MAX_PLAYERS} className="text-primary">
                            <UserPlus size={21} />
                        </IconButton>
                        <IconButton label="Deshacer" onClick={restoreLast} disabled={history.length === 0}>
                            <Undo2 size={20} />
                        </IconButton>
                        <IconButton label="Nueva partida" onClick={() => setIsRestartModalOpen(true)}>
                            <RotateCcw size={20} />
                        </IconButton>
                    </>
                }
            />

            <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 no-scrollbar">
                <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                        {players.map((player, idx) => (
                            <PlayerRow
                                key={player.id}
                                player={player}
                                index={idx}
                                active={idx === currentIndex && !winner}
                                rowRef={(el) => (rowRefs.current[player.id] = el)}
                                onEdit={() => {
                                    setEditing({ ...player, index: idx, isNew: false });
                                    setEditingOpen(true);
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </ul>
            </main>

            {/* Panel del turno */}
            <footer className="shrink-0 rounded-t-[28px] border-t border-white/10 bg-surface px-4 pt-4 shadow-sheet pb-safe-4">
                <div className="mb-3 flex items-center gap-3">
                    <Avatar name={currentPlayer.name} index={currentIndex} size={36} />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Turno de</p>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                                key={currentPlayer.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="truncate font-bold"
                            >
                                {currentPlayer.name}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                    <div className="text-right">
                        <AnimatedNumber value={turnScore} className="text-4xl font-extrabold leading-none text-primary tabular" />
                        <div className="mt-1 flex h-5 items-center justify-end gap-1.5">
                            <span className="max-w-[9rem] truncate text-xs font-medium text-white/40 tabular">
                                {turn.length > 0 ? turn.map(fmt).join(' + ') : 'Puntos del turno'}
                            </span>
                            {turn.length > 0 && (
                                <button
                                    onClick={removeLastRoll}
                                    aria-label="Quitar última tirada"
                                    className="flex size-6 items-center justify-center rounded-md text-white/50 transition active:scale-90 active:bg-white/10"
                                >
                                    <Delete size={15} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-3 grid grid-cols-4 gap-2">
                    {QUICK_POINTS.map((pts) => (
                        <motion.button
                            key={pts}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addRoll(pts)}
                            disabled={!!winner}
                            className="h-10 rounded-xl bg-primary/10 text-[15px] font-bold text-primary ring-1 ring-inset ring-primary/20 transition-colors active:bg-primary/20 disabled:opacity-30 tabular"
                        >
                            +{fmt(pts)}
                        </motion.button>
                    ))}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCustomOpen(true)}
                        disabled={!!winner}
                        className="h-10 rounded-xl bg-white/[0.06] text-[15px] font-bold text-white/80 ring-1 ring-inset ring-white/10 disabled:opacity-30"
                    >
                        Otro
                    </motion.button>
                </div>

                <div className="grid grid-cols-[1fr_1.4fr] gap-3">
                    <Button variant="danger" onClick={handleBust} disabled={!!winner}>
                        Perdió
                    </Button>
                    <Button onClick={handleBank} disabled={turnScore === 0 || !!winner}>
                        Plantarse{turnScore > 0 && <span className="tabular">+{fmt(turnScore)}</span>}
                    </Button>
                </div>
            </footer>

            <BottomSheet open={customOpen} onClose={() => setCustomOpen(false)} title="Otra cantidad" subtitle="Puntos de esta tirada">
                <form onSubmit={submitCustom}>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoFocus
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        placeholder="Ej: 350"
                        enterKeyHint="done"
                        className="mb-2 h-16 w-full rounded-2xl border-0 bg-white/[0.06] px-4 text-center text-3xl font-extrabold text-white ring-1 ring-inset ring-white/10 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary tabular"
                    />
                    <p className="mb-5 h-5 text-center text-xs text-white/40">
                        {customValue && parseInt(customValue, 10) % 50 !== 0 ? 'Ojo: en el 10.000 los puntos van de a 50' : ' '}
                    </p>
                    <Button type="submit" className="w-full" disabled={!customValue}>
                        Sumar al turno
                    </Button>
                </form>
            </BottomSheet>

            <PlayerSheet
                open={editingOpen}
                player={editing}
                onClose={() => setEditingOpen(false)}
                onSave={(name) => renamePlayer(editing.id, name)}
                onDelete={() => removePlayer(editing.id)}
                canDelete={players.length > 1}
            />

            <ConfirmationModal
                isOpen={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                onConfirm={restart}
                title="¿Nueva partida?"
                message="Todos los puntajes vuelven a cero. Los jugadores se mantienen."
                confirmLabel="Nueva partida"
            />

            <Toast toast={toast} onDismiss={dismissToast} bottom="calc(env(safe-area-inset-bottom) + 15.5rem)" />

            <WinnerOverlay
                open={!!winner && !dismissedWin}
                title={`¡Ganó ${winner?.name}!`}
                subtitle={winner && `Llegó a ${fmt(winner.score)} puntos`}
                actions={
                    <>
                        <Button onClick={restart}>Nueva partida</Button>
                        <Button variant="ghost" onClick={() => setDismissedWin(true)}>Ver tablero</Button>
                    </>
                }
            >
                {players.length > 1 && (
                    <ol className="space-y-1.5 text-left">
                        {ranking.map((p, pos) => (
                            <li key={p.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                                <span className="w-4 text-sm font-bold text-white/40 tabular">{pos + 1}</span>
                                <Avatar name={p.name} index={p.index} size={28} />
                                <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                                <span className="font-extrabold text-primary tabular">{fmt(p.score)}</span>
                            </li>
                        ))}
                    </ol>
                )}
            </WinnerOverlay>
        </div>
    );
}
