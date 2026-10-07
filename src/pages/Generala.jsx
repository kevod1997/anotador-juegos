import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Crown, RotateCcw, Trophy, UserPlus } from 'lucide-react';
import { GENERALA_CATEGORIES } from '../consts/rules';
import AppHeader from '../components/AppHeader';
import IconButton from '../components/IconButton';
import Avatar from '../components/Avatar';
import DiceFace from '../components/DiceFace';
import AnimatedNumber from '../components/AnimatedNumber';
import ScoreSelector from '../components/ScoreSelector';
import PlayerSheet from '../components/PlayerSheet';
import PlayerSetup from '../components/PlayerSetup';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import WinnerOverlay from '../components/WinnerOverlay';
import Button from '../components/Button';
import { STORAGE_KEYS, usePersistentState } from '../lib/storage';
import { feedback } from '../lib/feedback';
import { newId } from '../lib/players';
import { useRoster } from '../lib/roster';
import { useWakeLock } from '../lib/useWakeLock';
import { cn } from '../lib/cn';

const MAX_PLAYERS = 10;
const isNumberCategory = (cat) => /^[1-6]$/.test(cat.id);
const cellKey = (playerId, catId) => `${playerId}:${catId}`;
const formatScore = (v) => (v === 'GANA' ? '¡Gana!' : v === 0 ? 'tachado' : v);

const initialGame = () => ({ players: [], scores: {} }); // los jugadores se arman en PlayerSetup

function CategoryLabel({ cat }) {
    if (isNumberCategory(cat)) {
        return <DiceFace value={Number(cat.id)} size={24} className="text-white/85" title={cat.label} />;
    }
    return (
        <div className="flex flex-col leading-none" title={cat.label}>
            <span className="text-[12px] font-bold text-white/85">{cat.short}</span>
            <span className="mt-1 text-[10px] font-semibold text-white/35 tabular">{cat.points}</span>
        </div>
    );
}

function ScoreCell({ value, cat, onClick, highlight }) {
    const empty = value === undefined;
    const crossed = value === 0;
    const served = !empty && cat.served !== undefined && value === cat.served;

    return (
        <button
            onClick={onClick}
            className={cn(
                'relative flex h-full w-full items-center justify-center rounded-xl text-[17px] font-bold tabular transition-colors active:bg-white/10',
                empty && 'text-white/15',
                crossed && 'bg-red-500/10 text-danger/80',
                !empty && !crossed && 'bg-primary/10 text-primary',
                value === 'GANA' && 'bg-gold/15 text-gold',
                highlight && empty && 'bg-white/[0.03]'
            )}
            aria-label={`${cat.label}: ${empty ? 'vacío' : formatScore(value)}`}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={String(value)}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                    className="flex items-center"
                >
                    {empty ? '·' : crossed ? '✕' : value === 'GANA' ? <Trophy size={18} /> : value}
                </motion.span>
            </AnimatePresence>
            {served && value !== 'GANA' && (
                <span className="absolute right-1 top-1 text-[8px] font-extrabold uppercase text-primary/60">s</span>
            )}
        </button>
    );
}

export default function Generala() {
    useWakeLock();
    const [game, setGame] = usePersistentState(STORAGE_KEYS.generala, initialGame);
    const { players, scores } = game;
    const roster = useRoster();
    const navigate = useNavigate();

    const [cell, setCell] = useState(null); // { playerId, categoryId }
    const [cellOpen, setCellOpen] = useState(false);
    const [editing, setEditing] = useState(null); // { id, name, index, isNew }
    const [editingOpen, setEditingOpen] = useState(false);
    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [dismissedResult, setDismissedResult] = useState(null);

    const dismissToast = useCallback(() => setToast(null), []);

    const totals = useMemo(
        () =>
            players.map((p) =>
                GENERALA_CATEGORIES.reduce((sum, cat) => {
                    const v = scores[cellKey(p.id, cat.id)];
                    return typeof v === 'number' ? sum + v : sum;
                }, 0)
            ),
        [players, scores]
    );

    const filled = Object.keys(scores).length;
    const totalCells = players.length * GENERALA_CATEGORIES.length;
    const bestTotal = Math.max(...totals);
    const servedWinner = players.find((p) => scores[cellKey(p.id, 'generala')] === 'GANA');

    // Resultado: Generala servida gana en el acto; si no, al completar la planilla gana el de más puntos
    const result = useMemo(() => {
        if (servedWinner) return { key: `gana-${servedWinner.id}`, served: true, winners: [servedWinner] };
        if (filled > 0 && filled === totalCells) {
            const winners = players.filter((_, i) => totals[i] === bestTotal);
            return { key: `fin-${filled}-${bestTotal}`, served: false, winners };
        }
        return null;
    }, [servedWinner, filled, totalCells, players, totals, bestTotal]);

    const setScore = (playerId, categoryId, value) => {
        setGame((g) => {
            const next = { ...g.scores };
            if (value === undefined) delete next[cellKey(playerId, categoryId)];
            else next[cellKey(playerId, categoryId)] = value;
            return { ...g, scores: next };
        });
    };

    const applyScore = (value) => {
        if (!cell) return;
        const { playerId, categoryId } = cell;
        const previous = scores[cellKey(playerId, categoryId)];
        const player = players.find((p) => p.id === playerId);
        const cat = GENERALA_CATEGORIES.find((c) => c.id === categoryId);

        setScore(playerId, categoryId, value);
        setCellOpen(false);
        feedback(value === 0 ? 'bust' : value === undefined ? 'undo' : 'score');

        const action = value === undefined ? 'borró' : value === 0 ? 'tachó' : `anotó ${value === 'GANA' ? 'Generala servida' : value}`;
        setToast({
            id: Date.now(),
            message: `${player.name} ${action} en ${isNumberCategory(cat) ? `los ${cat.label}` : cat.label}`,
            onUndo: () => {
                setScore(playerId, categoryId, previous);
                feedback('undo');
            },
        });
    };

    const startGame = (names) => setGame({ players: names.map((name) => ({ id: newId(), name })), scores: {} });

    const addPlayer = () => {
        if (players.length >= MAX_PLAYERS) return;
        const player = { id: newId(), name: `Jugador ${players.length + 1}` };
        setGame((g) => ({ ...g, players: [...g.players, player] }));
        feedback('tap');
        setEditing({ ...player, index: players.length, isNew: true });
        setEditingOpen(true);
    };

    const renamePlayer = (id, name) => {
        setGame((g) => ({ ...g, players: g.players.map((p) => (p.id === id ? { ...p, name } : p)) }));
        roster.learn(name);
    };

    const removePlayer = (id) => {
        if (players.length <= 1) return; // Prevent removing last player
        setGame((g) => {
            const nextScores = Object.fromEntries(Object.entries(g.scores).filter(([k]) => !k.startsWith(`${id}:`)));
            return { players: g.players.filter((p) => p.id !== id), scores: nextScores };
        });
    };

    const restart = () => {
        setGame((g) => ({ ...g, scores: {} }));
        setDismissedResult(null);
        feedback('undo');
    };

    const activePlayerIndex = cell ? players.findIndex((p) => p.id === cell.playerId) : -1;
    const activeCategory = cell ? GENERALA_CATEGORIES.find((c) => c.id === cell.categoryId) : null;
    const showResult = !!result && dismissedResult !== result.key;
    const ranking = players
        .map((p, i) => ({ ...p, index: i, total: totals[i] }))
        .sort((a, b) => b.total - a.total);

    // Sin jugadores todavía: primero se arma la partida
    if (players.length === 0) {
        return (
            <div className="flex h-[100dvh] flex-col">
                <AppHeader title="La Generala" subtitle="Armá la partida" />
                <PlayerSetup
                    open
                    subtitle="Generala"
                    max={MAX_PLAYERS}
                    defaultCount={2}
                    roster={roster}
                    onConfirm={startGame}
                    onCancel={() => navigate('/')}
                />
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] flex-col">
            <AppHeader
                title="La Generala"
                subtitle={`${players.length} ${players.length === 1 ? 'jugador' : 'jugadores'} · ${filled}/${totalCells} casillas`}
                actions={
                    <>
                        <IconButton label="Agregar jugador" onClick={addPlayer} disabled={players.length >= MAX_PLAYERS} className="text-primary">
                            <UserPlus size={21} />
                        </IconButton>
                        <IconButton label="Nueva partida" onClick={() => setIsRestartModalOpen(true)}>
                            <RotateCcw size={20} />
                        </IconButton>
                    </>
                }
            />

            <main className="min-h-0 flex-1 overflow-auto overscroll-contain no-scrollbar">
                <div
                    className="grid min-h-full"
                    style={{
                        gridTemplateColumns: `56px repeat(${players.length}, minmax(54px, 1fr))`,
                        gridTemplateRows: `auto repeat(${GENERALA_CATEGORIES.length}, minmax(42px, 1fr)) auto`,
                    }}
                >
                    {/* Esquina */}
                    <div className="sticky left-0 top-0 z-30 border-b border-line bg-background-dark" />

                    {/* Encabezado de jugadores: iniciales + nombre corto, tocar para editar */}
                    {players.map((player, idx) => (
                        <button
                            key={player.id}
                            onClick={() => {
                                setEditing({ ...player, index: idx, isNew: false });
                                setEditingOpen(true);
                            }}
                            className="sticky top-0 z-20 flex min-w-0 flex-col items-center gap-1 border-b border-line bg-background-dark px-1 pb-2 pt-2.5 transition-colors active:bg-white/5"
                        >
                            <span className="relative">
                                <Avatar name={player.name} index={idx} size={32} />
                                {totals[idx] === bestTotal && bestTotal > 0 && players.length > 1 && (
                                    <motion.span
                                        initial={{ scale: 0, y: 4 }}
                                        animate={{ scale: 1, y: 0 }}
                                        className="absolute -right-1.5 -top-2 text-gold"
                                    >
                                        <Crown size={14} fill="currentColor" />
                                    </motion.span>
                                )}
                            </span>
                            <span className="w-full truncate text-center text-[11px] font-semibold text-white/60">{player.name}</span>
                        </button>
                    ))}

                    {/* Filas de categorías */}
                    {GENERALA_CATEGORIES.map((cat) => {
                        const divider = cat.id === 'escalera';
                        return (
                            <React.Fragment key={cat.id}>
                                <div
                                    className={cn(
                                        'sticky left-0 z-10 flex items-center border-b border-line bg-background-dark pl-4',
                                        divider && 'border-t border-t-white/15'
                                    )}
                                >
                                    <CategoryLabel cat={cat} />
                                </div>
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className={cn('border-b border-l border-line p-1', divider && 'border-t border-t-white/15')}
                                    >
                                        <ScoreCell
                                            value={scores[cellKey(player.id, cat.id)]}
                                            cat={cat}
                                            highlight={cell?.playerId === player.id && cellOpen}
                                            onClick={() => {
                                                setCell({ playerId: player.id, categoryId: cat.id });
                                                setCellOpen(true);
                                                feedback('tap');
                                            }}
                                        />
                                    </div>
                                ))}
                            </React.Fragment>
                        );
                    })}

                    {/* Totales fijos abajo */}
                    <div className="sticky bottom-0 left-0 z-30 flex items-center border-t border-white/15 bg-ink pb-safe pl-4">
                        <span className="py-3 text-[11px] font-bold uppercase tracking-wider text-white/50">Total</span>
                    </div>
                    {players.map((player, idx) => {
                        const leader = totals[idx] === bestTotal && bestTotal > 0;
                        const won = servedWinner?.id === player.id;
                        return (
                            <div
                                key={player.id}
                                className="sticky bottom-0 z-20 flex items-center justify-center border-l border-t border-line border-t-white/15 bg-ink pb-safe"
                            >
                                <span className={cn('py-3 text-xl font-extrabold tabular', leader ? 'text-primary' : 'text-white/85', won && 'text-gold')}>
                                    {won ? <Trophy size={22} className="inline" /> : <AnimatedNumber value={totals[idx]} />}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </main>

            <ScoreSelector
                isOpen={cellOpen}
                onClose={() => setCellOpen(false)}
                onSelect={applyScore}
                onClear={() => applyScore(undefined)}
                category={activeCategory}
                current={cell ? scores[cellKey(cell.playerId, cell.categoryId)] : undefined}
                title={activePlayerIndex >= 0 ? players[activePlayerIndex].name : ''}
                icon={activePlayerIndex >= 0 && <Avatar name={players[activePlayerIndex].name} index={activePlayerIndex} size={40} />}
            />

            <PlayerSheet
                open={editingOpen}
                player={editing}
                onClose={() => setEditingOpen(false)}
                onSave={(name) => renamePlayer(editing.id, name)}
                onDelete={() => removePlayer(editing.id)}
                canDelete={players.length > 1}
                suggestions={roster.names.filter((n) => !players.some((p) => p.name === n))}
            />

            <ConfirmationModal
                isOpen={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                onConfirm={restart}
                title="¿Nueva partida?"
                message="Se borrarán todos los puntajes actuales. Los jugadores se mantienen."
                confirmLabel="Nueva partida"
            />

            <Toast toast={toast} onDismiss={dismissToast} bottom="calc(env(safe-area-inset-bottom) + 4.5rem)" />

            <WinnerOverlay
                open={showResult}
                title={
                    result?.served
                        ? '¡Generala servida!'
                        : result?.winners.length > 1
                            ? '¡Empate!'
                            : `¡Ganó ${result?.winners[0]?.name}!`
                }
                subtitle={
                    result?.served
                        ? `${result.winners[0].name} gana la partida`
                        : result?.winners.length > 1
                            ? `${result.winners.map((w) => w.name).join(' y ')} con ${bestTotal} puntos`
                            : `${bestTotal} puntos`
                }
                actions={
                    <>
                        <Button onClick={restart}>Nueva partida</Button>
                        <Button variant="ghost" onClick={() => setDismissedResult(result.key)}>Ver planilla</Button>
                    </>
                }
            >
                {!result?.served && players.length > 1 && (
                    <ol className="space-y-1.5 text-left">
                        {ranking.map((p, pos) => (
                            <li key={p.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                                <span className="w-4 text-sm font-bold text-white/40 tabular">{pos + 1}</span>
                                <Avatar name={p.name} index={p.index} size={28} />
                                <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                                <span className="font-extrabold text-primary tabular">{p.total}</span>
                            </li>
                        ))}
                    </ol>
                )}
            </WinnerOverlay>
        </div>
    );
}
