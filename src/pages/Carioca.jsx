import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Crown, Layers, PencilLine, RotateCcw, Trophy, UserPlus } from 'lucide-react';
import { CARIOCA_HANDS, CARIOCA_TOTAL_HANDS, cardsForHand } from '../consts/carioca';
import AppHeader from '../components/AppHeader';
import IconButton from '../components/IconButton';
import Avatar from '../components/Avatar';
import AnimatedNumber from '../components/AnimatedNumber';
import PlayerSheet from '../components/PlayerSheet';
import PlayerSetup from '../components/PlayerSetup';
import DealOrderSheet from '../components/DealOrderSheet';
import HandSheet from '../components/HandSheet';
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

const MAX_PLAYERS = 8;

// players: en orden de repartida, cada uno con su color fijo.
// dealerId: quién reparte la mano en curso. hands: [{ dealerId, scores: { [playerId]: puntos } }]
// ready: false mientras se elige el orden de repartida al armar la partida.
const initialGame = () => ({ players: [], dealerId: null, hands: [], ready: false });

// El que sigue en la ronda de repartida
const nextInOrder = (players, id) => {
    const i = players.findIndex((p) => p.id === id);
    return players[(i + 1) % players.length]?.id ?? players[0]?.id ?? null;
};

export default function Carioca() {
    useWakeLock();
    const [game, setGame] = usePersistentState(STORAGE_KEYS.carioca, initialGame);
    const { players, dealerId, hands, ready } = game;
    const roster = useRoster();
    const navigate = useNavigate();

    const [handSheet, setHandSheet] = useState(null); // { index } — index === hands.length es la mano nueva
    const [handOpen, setHandOpen] = useState(false);
    const [orderOpen, setOrderOpen] = useState(false);
    const [editing, setEditing] = useState(null); // { id, name, index, isNew }
    const [editingOpen, setEditingOpen] = useState(false);
    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [dismissedResult, setDismissedResult] = useState(null);
    const dismissToast = useCallback(() => setToast(null), []);

    const played = hands.length;
    const finished = played >= CARIOCA_TOTAL_HANDS;
    const handNumber = played + 1; // mano en curso
    const dealerIndex = Math.max(0, players.findIndex((p) => p.id === dealerId));
    const dealer = players[dealerIndex];

    const totals = useMemo(
        () => players.map((p) => hands.reduce((sum, h) => sum + (h.scores[p.id] ?? 0), 0)),
        [players, hands]
    );
    const bestTotal = Math.min(...totals);

    // Quién reparte cada mano: la anotada guarda su repartidor; las que faltan siguen la ronda desde el actual
    const dealerOfHand = (index) =>
        index < played ? hands[index].dealerId : players[(dealerIndex + index - played) % players.length]?.id;

    const result = useMemo(() => {
        if (!finished || players.length === 0) return null;
        const winners = players.filter((_, i) => totals[i] === bestTotal);
        return { key: `fin-${hands.map((h) => Object.values(h.scores).join('.')).join('-')}`, winners };
    }, [finished, players, totals, bestTotal, hands]);

    const colorOf = (player, i) => player.color ?? i;

    // --- Armado de la partida ---

    const startGame = (names) => {
        const list = names.map((name, i) => ({ id: newId(), name, color: i }));
        setGame({ players: list, dealerId: list[0].id, hands: [], ready: false });
    };

    const confirmOrder = (order, dealerIdPicked) => {
        setGame((g) => ({ ...g, players: order, dealerId: dealerIdPicked, ready: true }));
        setOrderOpen(false);
        feedback('tap');
    };

    // --- Manos ---

    const openHand = (index) => {
        setHandSheet({ index });
        setHandOpen(true);
        feedback('tap');
    };

    const saveHand = (scores) => {
        const { index } = handSheet;
        const previous = { hands: game.hands, dealerId: game.dealerId };
        const isNew = index >= hands.length;

        setGame((g) => {
            if (isNew) {
                return {
                    ...g,
                    hands: [...g.hands, { dealerId: g.dealerId, scores }],
                    dealerId: nextInOrder(g.players, g.dealerId),
                };
            }
            // Al corregir se conservan los puntos de jugadores que ya no están en la partida
            return { ...g, hands: g.hands.map((h, i) => (i === index ? { ...h, scores: { ...h.scores, ...scores } } : h)) };
        });
        setHandOpen(false);
        feedback('score');
        setToast({
            id: Date.now(),
            message: isNew ? `Mano ${index + 1} anotada` : `Mano ${index + 1} corregida`,
            onUndo: () => {
                setGame((g) => ({ ...g, ...previous }));
                setDismissedResult(null);
                feedback('undo');
            },
        });
    };

    // Solo se puede borrar la última mano anotada: vuelve a quedar en curso con su repartidor
    const deleteLastHand = () => {
        const previous = { hands: game.hands, dealerId: game.dealerId };
        const last = hands[hands.length - 1];
        setGame((g) => ({
            ...g,
            hands: g.hands.slice(0, -1),
            dealerId: g.players.some((p) => p.id === last.dealerId) ? last.dealerId : g.dealerId,
        }));
        setHandOpen(false);
        setDismissedResult(null);
        feedback('undo');
        setToast({
            id: Date.now(),
            message: `Mano ${hands.length} borrada`,
            onUndo: () => {
                setGame((g) => ({ ...g, ...previous }));
                feedback('undo');
            },
        });
    };

    // --- Jugadores ---

    const addPlayer = () => {
        if (players.length >= MAX_PLAYERS) return;
        const color = players.reduce((max, p) => Math.max(max, p.color ?? 0), -1) + 1;
        const player = { id: newId(), name: `Jugador ${players.length + 1}`, color };
        setGame((g) => ({ ...g, players: [...g.players, player] }));
        feedback('tap');
        setEditing({ ...player, index: color, isNew: true });
        setEditingOpen(true);
    };

    const renamePlayer = (id, name) => {
        setGame((g) => ({ ...g, players: g.players.map((p) => (p.id === id ? { ...p, name } : p)) }));
        roster.learn(name);
    };

    const removePlayer = (id) => {
        if (players.length <= 2) return;
        setGame((g) => ({
            ...g,
            players: g.players.filter((p) => p.id !== id),
            // Si reparte el que se va, pasa al siguiente de la ronda
            dealerId: g.dealerId === id ? nextInOrder(g.players, id) : g.dealerId,
        }));
    };

    // Al cerrar la hoja de un jugador nuevo se abre el orden para ubicarlo en la ronda
    const closePlayerSheet = () => {
        setEditingOpen(false);
        if (editing?.isNew && !finished) setTimeout(() => setOrderOpen(true), 250);
    };

    const restart = () => {
        setGame(initialGame()); // vuelve al armado de jugadores
        setDismissedResult(null);
        feedback('undo');
    };

    const showResult = !!result && dismissedResult !== result.key;
    const ranking = players
        .map((p, i) => ({ ...p, index: i, total: totals[i] }))
        .sort((a, b) => a.total - b.total);

    // Sin jugadores todavía: primero se arma la partida
    if (players.length === 0) {
        return (
            <div className="flex h-[100dvh] flex-col">
                <AppHeader title="Carioca" subtitle="Armá la partida" />
                <PlayerSetup
                    open
                    subtitle="Carioca"
                    min={2}
                    max={MAX_PLAYERS}
                    defaultCount={3}
                    roster={roster}
                    onConfirm={startGame}
                    onCancel={() => navigate('/')}
                />
            </div>
        );
    }

    // Jugadores elegidos: falta el orden de repartida
    if (!ready) {
        return (
            <div className="flex h-[100dvh] flex-col">
                <AppHeader title="Carioca" subtitle="Orden de repartida" />
                <DealOrderSheet
                    open
                    setup
                    players={players}
                    dealerId={dealerId}
                    handNumber={1}
                    onConfirm={confirmOrder}
                    onCancel={() => setGame(initialGame())}
                />
            </div>
        );
    }

    const sheetIndex = handSheet?.index ?? 0;
    const sheetHand = CARIOCA_HANDS[sheetIndex];
    const sheetDealer = players.find((p) => p.id === dealerOfHand(sheetIndex));
    const sheetEditing = handSheet && sheetIndex < played;
    const currentHand = CARIOCA_HANDS[played];

    return (
        <div className="flex h-[100dvh] flex-col">
            <AppHeader
                title="Carioca"
                subtitle={finished ? 'Partida terminada' : `${players.length} jugadores · gana el que suma menos`}
                actions={
                    <>
                        <IconButton label="Agregar jugador" onClick={addPlayer} disabled={players.length >= MAX_PLAYERS} className="text-primary">
                            <UserPlus size={21} />
                        </IconButton>
                        <IconButton label="Orden de repartida" onClick={() => setOrderOpen(true)} disabled={finished}>
                            <ArrowUpDown size={20} />
                        </IconButton>
                        <IconButton label="Nueva partida" onClick={() => setIsRestartModalOpen(true)}>
                            <RotateCcw size={20} />
                        </IconButton>
                    </>
                }
            />

            {/* Mano en curso: contrato, quién reparte y cuántas cartas */}
            <div className="shrink-0 px-3 pt-3">
                {finished ? (
                    <div className="surface-card flex items-center gap-3 rounded-2xl p-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40">
                            <Trophy size={22} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Partida terminada</p>
                            <p className="truncate font-bold">
                                {result?.winners.length > 1
                                    ? `Empate: ${result.winners.map((w) => w.name).join(' y ')}`
                                    : `Ganó ${result?.winners[0]?.name}`}
                            </p>
                        </div>
                        <Button className="h-11 shrink-0 px-4 text-sm" onClick={() => setDismissedResult(null)}>
                            Ver resultado
                        </Button>
                    </div>
                ) : (
                    <motion.div
                        key={played}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="surface-card rounded-2xl p-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Mano {handNumber} de {CARIOCA_TOTAL_HANDS}
                                </p>
                                <p className="line-clamp-2 text-lg font-extrabold leading-tight">{currentHand.label}</p>
                            </div>
                            <Button className="h-11 shrink-0 px-4 text-sm" onClick={() => openHand(played)}>
                                <PencilLine size={18} />
                                Anotar
                            </Button>
                        </div>
                        <button
                            onClick={() => setOrderOpen(true)}
                            className="mt-2.5 flex w-full items-center gap-2 rounded-xl bg-white/[0.04] px-2 py-1.5 text-left transition active:bg-white/10"
                        >
                            {dealer && <Avatar name={dealer.name} index={colorOf(dealer, dealerIndex)} size={24} />}
                            <span className="min-w-0 flex-1 truncate text-sm">
                                Reparte <strong className="font-bold">{dealer?.name}</strong>
                            </span>
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                <Layers size={12} />
                                {cardsForHand(handNumber)} cartas
                            </span>
                        </button>
                    </motion.div>
                )}
            </div>

            <main className="mt-2 min-h-0 flex-1 overflow-auto overscroll-contain no-scrollbar">
                <div
                    className="grid min-h-full"
                    style={{
                        gridTemplateColumns: `104px repeat(${players.length}, minmax(54px, 1fr))`,
                        gridTemplateRows: `auto repeat(${CARIOCA_TOTAL_HANDS}, minmax(46px, 1fr)) auto`,
                    }}
                >
                    {/* Esquina */}
                    <div className="sticky left-0 top-0 z-30 border-b border-line bg-background-dark" />

                    {/* Encabezado de jugadores en orden de repartida: tocar para editar */}
                    {players.map((player, idx) => (
                        <button
                            key={player.id}
                            onClick={() => {
                                setEditing({ ...player, index: colorOf(player, idx), isNew: false });
                                setEditingOpen(true);
                            }}
                            className="sticky top-0 z-20 flex min-w-0 flex-col items-center gap-1 border-b border-line bg-background-dark px-1 pb-2 pt-2.5 transition-colors active:bg-white/5"
                        >
                            <span className="relative">
                                <Avatar name={player.name} index={colorOf(player, idx)} size={32} />
                                {played > 0 && players.length > 1 && totals[idx] === bestTotal && (
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

                    {/* Filas de manos */}
                    {CARIOCA_HANDS.map((hand, index) => {
                        const done = index < played;
                        const current = index === played;
                        const rowDealer = dealerOfHand(index);
                        return (
                            <React.Fragment key={hand.label}>
                                <button
                                    disabled={!done && !current}
                                    onClick={() => openHand(index)}
                                    className={cn(
                                        'sticky left-0 z-10 flex items-center gap-2 border-b border-line bg-background-dark pl-3 pr-1 text-left transition-colors active:bg-white/5',
                                        current && 'bg-surface'
                                    )}
                                    aria-label={`Mano ${index + 1}: ${hand.label}`}
                                >
                                    <span
                                        className={cn(
                                            'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tabular',
                                            current ? 'bg-primary text-background-dark' : done ? 'bg-white/10 text-white/80' : 'text-white/30 ring-1 ring-inset ring-white/10'
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                    <span
                                        className={cn(
                                            'line-clamp-2 text-[11px] font-semibold leading-tight',
                                            current ? 'text-white' : done ? 'text-white/70' : 'text-white/30'
                                        )}
                                    >
                                        {hand.short}
                                    </span>
                                </button>
                                {players.map((player) => {
                                    const value = done ? hands[index].scores[player.id] : undefined;
                                    const deals = rowDealer === player.id;
                                    return (
                                        <div key={player.id} className={cn('border-b border-l border-line p-1', current && 'bg-surface/60')}>
                                            <button
                                                disabled={!done && !current}
                                                onClick={() => openHand(index)}
                                                className={cn(
                                                    'relative flex h-full w-full items-center justify-center rounded-xl text-[17px] font-bold tabular transition-colors active:bg-white/10',
                                                    done && value !== undefined && 'bg-white/[0.04] text-white/90',
                                                    done && value === undefined && 'text-white/20',
                                                    current && 'bg-primary/[0.06] text-primary/40 ring-1 ring-inset ring-primary/20',
                                                    !done && !current && 'text-white/10'
                                                )}
                                                aria-label={`${player.name}, mano ${index + 1}: ${value ?? 'sin anotar'}`}
                                            >
                                                {done ? (value ?? '—') : '·'}
                                                {deals && (
                                                    <span
                                                        className={cn(
                                                            'absolute right-1 top-1 text-[8px] font-extrabold uppercase',
                                                            current ? 'text-primary' : done ? 'text-white/35' : 'text-white/20'
                                                        )}
                                                    >
                                                        rep
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}

                    {/* Totales fijos abajo: gana el que suma menos */}
                    <div className="sticky bottom-0 left-0 z-30 flex items-center border-t border-white/15 bg-ink pb-safe pl-3">
                        <span className="py-3 text-[11px] font-bold uppercase tracking-wider text-white/50">Total</span>
                    </div>
                    {players.map((player, idx) => {
                        const leader = played > 0 && totals[idx] === bestTotal;
                        const won = finished && leader;
                        return (
                            <div
                                key={player.id}
                                className="sticky bottom-0 z-20 flex items-center justify-center border-l border-t border-line border-t-white/15 bg-ink pb-safe"
                            >
                                <span className={cn('py-3 text-xl font-extrabold tabular', won ? 'text-gold' : leader ? 'text-primary' : 'text-white/85')}>
                                    <AnimatedNumber value={totals[idx]} />
                                </span>
                            </div>
                        );
                    })}
                </div>
            </main>

            <HandSheet
                open={handOpen}
                title={`Mano ${sheetIndex + 1} · ${sheetHand?.label ?? ''}`}
                subtitle={`${sheetEditing ? 'Corregir · ' : ''}Reparte ${sheetDealer?.name ?? '—'} · ${cardsForHand(sheetIndex + 1)} cartas`}
                players={players}
                initial={sheetEditing ? hands[sheetIndex].scores : undefined}
                optional={sheetEditing ? players.filter((p) => hands[sheetIndex].scores[p.id] === undefined).map((p) => p.id) : []}
                onSave={saveHand}
                onClose={() => setHandOpen(false)}
                onDelete={sheetEditing && sheetIndex === played - 1 ? deleteLastHand : undefined}
            />

            <DealOrderSheet
                open={orderOpen}
                players={players}
                dealerId={dealerId}
                handNumber={handNumber}
                onConfirm={confirmOrder}
                onCancel={() => setOrderOpen(false)}
            />

            <PlayerSheet
                open={editingOpen}
                player={editing}
                onClose={closePlayerSheet}
                onSave={(name) => renamePlayer(editing.id, name)}
                onDelete={() => removePlayer(editing.id)}
                canDelete={players.length > 2}
                suggestions={roster.names.filter((n) => !players.some((p) => p.name === n))}
            />

            <ConfirmationModal
                isOpen={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                onConfirm={restart}
                title="¿Nueva partida?"
                message="Se borrarán todos los puntajes y vas a elegir los jugadores de nuevo."
                confirmLabel="Nueva partida"
            />

            <Toast toast={toast} onDismiss={dismissToast} bottom="calc(env(safe-area-inset-bottom) + 4.5rem)" />

            <WinnerOverlay
                open={showResult}
                title={result?.winners.length > 1 ? '¡Empate!' : `¡Ganó ${result?.winners[0]?.name}!`}
                subtitle={
                    result?.winners.length > 1
                        ? `${result.winners.map((w) => w.name).join(' y ')} con ${bestTotal} puntos`
                        : `Con ${bestTotal} puntos, el que menos sumó`
                }
                actions={
                    <>
                        <Button onClick={restart}>Nueva partida</Button>
                        <Button variant="ghost" onClick={() => setDismissedResult(result.key)}>Ver planilla</Button>
                    </>
                }
            >
                <ol className="space-y-1.5 text-left">
                    {ranking.map((p, pos) => (
                        <li key={p.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                            <span className="w-4 text-sm font-bold text-white/40 tabular">{pos + 1}</span>
                            <Avatar name={p.name} index={colorOf(p, p.index)} size={28} />
                            <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                            <span className="font-extrabold text-primary tabular">{p.total}</span>
                        </li>
                    ))}
                </ol>
            </WinnerOverlay>
        </div>
    );
}
