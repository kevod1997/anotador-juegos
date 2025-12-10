import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GENERALA_CATEGORIES } from '../consts/rules';
import ScoreSelector from '../components/ScoreSelector';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Generala() {
    const [players, setPlayers] = useState(['Alex']);
    const [scores, setScores] = useState({});
    const [activeCell, setActiveCell] = useState(null); // { playerIndex, categoryId }
    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);

    const handleScoreSelect = (value) => {
        if (activeCell) {
            setScores(prev => ({
                ...prev,
                [`${activeCell.playerIndex}-${activeCell.categoryId}`]: value
            }));
            setActiveCell(null);
        }
    };

    const removePlayer = (indexToRemove) => {
        if (players.length <= 1) return; // Prevent removing last player

        // Remove player name
        const newPlayers = players.filter((_, idx) => idx !== indexToRemove);
        setPlayers(newPlayers);

        // Shift scores
        // This is tricky because keys are `index-catId`.
        // Easier approach: Rebuild scores object.
        const newScores = {};
        let newPlayerIdx = 0;

        // Iterate through old player indices
        for (let oldIdx = 0; oldIdx < players.length; oldIdx++) {
            if (oldIdx === indexToRemove) continue; // Skip removed player

            // Copy scores for this player to their new index
            GENERALA_CATEGORIES.forEach(cat => {
                const oldKey = `${oldIdx}-${cat.id}`;
                if (scores[oldKey] !== undefined) {
                    newScores[`${newPlayerIdx}-${cat.id}`] = scores[oldKey];
                }
            });
            newPlayerIdx++;
        }
        setScores(newScores);
    };

    const calculateTotal = (playerIndex) => {
        let total = 0;
        GENERALA_CATEGORIES.forEach(cat => {
            const val = scores[`${playerIndex}-${cat.id}`];
            if (val === 'GANA') {
                // GANA implies win, but for total calc we might treat as huge or just display WIN
                return 'WIN';
            }
            if (val !== undefined && val !== null) {
                total += parseInt(val, 10) || 0;
            }
        });
        return total;
    };

    // Check if player won instantly
    const checkWin = (playerIndex) => {
        const val = scores[`${playerIndex}-generala`];
        return val === 'GANA';
    };

    // Logic to determine grid display
    // Using native CSS Grid for sticky behavior requires consistent sizing.
    // We will stick to the previous grid approach but with fixed widths for columns.
    const COL_WIDTH = '110px';
    const LABEL_COL_WIDTH = '100px';

    return (
        <>
            <header className="sticky top-0 z-30 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80 transition-colors">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    <Link to="/" className="flex size-8 items-center justify-center rounded-full text-black dark:text-white cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </Link>
                </div>
                <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-black dark:text-white">La Generala</h1>
                <div className="flex w-24 items-center justify-end gap-2">
                    <button
                        onClick={() => setPlayers([...players, `Jugador ${players.length + 1}`])}
                        className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/10 dark:active:bg-white/20 transition-colors"
                        aria-label="Agregar Jugador"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button
                        onClick={() => setIsRestartModalOpen(true)}
                        className="flex size-10 items-center justify-center rounded-full text-neutral-400 hover:bg-black/5 active:bg-black/10 dark:text-neutral-400 dark:hover:bg-white/10 dark:active:bg-white/20 transition-colors"
                        aria-label="Nueva Partida"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow overflow-hidden flex flex-col">
                {/* The main container handles the overall layout */}
                <div className="w-full overflow-auto flex-1 relative">

                    {/* Grid Container */}
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: `${LABEL_COL_WIDTH} repeat(${players.length}, ${COL_WIDTH})`,
                            minWidth: 'fit-content' // Ensure it expands
                        }}
                    >
                        {/* 1. Header Row (Player Names) */}

                        {/* Corner Cell */}
                        <div className="sticky left-0 top-0 z-30 flex items-center border-b border-white/10 bg-background-light p-4 dark:bg-background-dark outline outline-1 outline-white/5 shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
                            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Categoría</p>
                        </div>

                        {/* Player Headers */}
                        {players.map((player, idx) => (
                            <div key={`header-${idx}`} className="sticky top-0 z-10 flex flex-col gap-1 border-b border-white/10 bg-background-light p-2 dark:bg-background-dark outline outline-1 outline-white/5">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-xs text-neutral-400">Jugador {idx + 1}</span>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`¿Eliminar a ${player}?`)) removePlayer(idx);
                                        }}
                                        className="text-red-500 hover:bg-red-500/10 rounded-full p-1"
                                        disabled={players.length <= 1}
                                    >
                                        <span className="material-symbols-outlined !text-sm">close</span>
                                    </button>
                                </div>
                                <input
                                    className="w-full resize-none overflow-hidden rounded-lg border-none bg-white/5 p-1 text-center text-sm font-medium text-black placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-white/5 dark:placeholder:text-neutral-400"
                                    value={player}
                                    onChange={(e) => {
                                        const newPlayers = [...players];
                                        newPlayers[idx] = e.target.value;
                                        setPlayers(newPlayers);
                                    }}
                                />
                            </div>
                        ))}




                        {/* 2. Data Rows */}
                        {GENERALA_CATEGORIES.map((cat) => (
                            <React.Fragment key={cat.id}>
                                {/* Label Column (Sticky Left) */}
                                <div className="sticky left-0 z-20 flex items-center border-b border-white/10 bg-background-light p-4 dark:bg-background-dark outline outline-1 outline-white/5 shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{cat.label}</p>
                                </div>

                                {/* Player Cells */}
                                {players.map((_, pIdx) => {
                                    const score = scores[`${pIdx}-${cat.id}`];
                                    return (
                                        <div key={`${cat.id}-${pIdx}`} className="flex items-center justify-center border-b border-white/10 p-2 outline outline-1 outline-white/5">
                                            <button
                                                onClick={() => setActiveCell({ playerIndex: pIdx, categoryId: cat.id })}
                                                className={`h-10 w-full rounded-lg border-none p-2 text-center text-base font-bold transition-colors ${score === undefined
                                                    ? 'bg-transparent text-neutral-500 hover:bg-white/5'
                                                    : score === 0
                                                        ? 'bg-red-500/10 text-red-400'
                                                        : 'bg-primary/10 text-primary'
                                                    }`}
                                            >
                                                {score === undefined ? '-' : (score === 0 ? 'X' : score)}
                                            </button>
                                        </div>
                                    );
                                })}


                            </React.Fragment>
                        ))}


                        {/* 3. Total Row */}
                        <div className="sticky left-0 bottom-0 z-30 flex items-center bg-background-light p-4 dark:bg-background-dark border-t-2 border-primary/20 outline outline-1 outline-white/5 shadow-[4px_-4px_12px_rgba(0,0,0,0.3)]">
                            <p className="text-base font-bold text-black dark:text-white">Total</p>
                        </div>

                        {players.map((_, pIdx) => {
                            const total = calculateTotal(pIdx);
                            const isWin = checkWin(pIdx);
                            return (
                                <div key={`total-${pIdx}`} className="sticky bottom-0 z-10 flex items-center justify-center p-4 border-t-2 border-primary/20 bg-background-light dark:bg-background-dark outline outline-1 outline-white/5 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
                                    <p className="text-xl font-bold text-primary">
                                        {isWin ? '🏆' : total}
                                    </p>
                                </div>
                            );
                        })}


                    </div>
                </div>
            </main>

            {/* Score Selection Modal */}
            {activeCell && (
                <ScoreSelector
                    isOpen={!!activeCell}
                    onClose={() => setActiveCell(null)}
                    onSelect={handleScoreSelect}
                    title={`${players[activeCell.playerIndex]} - ${GENERALA_CATEGORIES.find(c => c.id === activeCell.categoryId)?.label}`}
                    options={GENERALA_CATEGORIES.find(c => c.id === activeCell.categoryId)?.options}
                />
            )}

            <ConfirmationModal
                isOpen={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                onConfirm={() => setScores({})}
                title="¿Reiniciar partida?"
                message="Se borrarán todos los puntajes actuales. Esta acción no se puede deshacer."
            />
        </>
    );
}
