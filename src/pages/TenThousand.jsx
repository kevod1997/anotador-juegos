import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TenThousand() {
    const [players, setPlayers] = useState([
        { name: 'Jugador 1', score: 0 },
        { name: 'Jugador 2', score: 0 },
        { name: 'Jugador 3', score: 0 }
    ]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [turnScore, setTurnScore] = useState(0);
    const [rollInput, setRollInput] = useState('');

    const handleAddRoll = () => {
        const points = parseInt(rollInput, 10);
        if (!isNaN(points)) {
            setTurnScore(prev => prev + points);
            setRollInput('');
        }
    };

    const handleBank = () => { // Plantarse
        const newPlayers = [...players];
        const newScore = newPlayers[currentPlayer].score + turnScore;
        newPlayers[currentPlayer].score = Math.min(newScore, 10000); // El objetivo es llegar a 10.000

        setPlayers(newPlayers);
        setTurnScore(0);
        setRollInput('');

        if (newScore >= 10000) {
            alert(`¡${players[currentPlayer].name} Ganó!`);
        } else {
            nextTurn();
        }
    };

    const handleBust = () => {
        setTurnScore(0);
        setRollInput('');
        nextTurn();
    };

    const nextTurn = () => {
        setCurrentPlayer((prev) => (prev + 1) % players.length);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col text-black dark:text-white pb-80 bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <header className="sticky top-0 z-10 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-2">
                <div className="flex h-12 items-center justify-between">
                    <div className="flex size-12 shrink-0 items-center justify-start">
                        <Link to="/" className="flex size-8 items-center justify-center rounded-full text-black dark:text-white cursor-pointer">
                            <span className="material-symbols-outlined">arrow_back_ios_new</span>
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">El 10.000</h1>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-zinc-900 dark:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Player Scores */}
            <main className="flex flex-col gap-4 p-4">
                {players.map((player, idx) => {
                    const isActive = idx === currentPlayer;
                    const isWinner = player.score >= 10000;
                    return (
                        <div
                            key={idx}
                            className={`flex flex-col gap-3 rounded-xl p-4 border transition-all ${isActive
                                ? 'bg-white/10 ring-2 ring-primary shadow-lg shadow-primary/20 border-transparent'
                                : 'bg-white/5 border-white/10 opacity-80'
                                }`}
                        >
                            <div className="flex flex-col items-stretch justify-start">
                                <div className="flex w-full grow flex-col items-stretch justify-center gap-1">
                                    <p className={`text-lg font-bold leading-tight tracking-[-0.015em] ${isActive ? 'text-primary' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                        {player.name}
                                    </p>
                                    <div className="flex items-end justify-between gap-3">
                                        <p className="text-3xl font-bold leading-normal text-black dark:text-white">{player.score}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-end gap-6">
                                    <p className="text-sm font-normal leading-normal text-zinc-600 dark:text-zinc-400">{player.score} / 10000</p>
                                </div>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full ${isWinner ? 'bg-yellow-400' : 'bg-primary'} transition-all duration-500`}
                                        style={{ width: `${Math.min((player.score / 10000) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>

            {/* Floating Action Panel */}
            <footer className="fixed bottom-0 left-0 right-0 z-20 w-full p-4">
                <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/90 dark:bg-zinc-800/90 p-6 backdrop-blur-xl shadow-2xl">
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Turno de {players[currentPlayer].name}</p>
                        <p className="text-base font-medium text-zinc-800 dark:text-zinc-300">Puntaje del Turno</p>
                        <p className="text-5xl font-extrabold text-primary">{turnScore}</p>
                    </div>

                    {/* Roll Input Area */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={rollInput}
                            onChange={(e) => setRollInput(e.target.value)}
                            placeholder="Puntos..."
                            className="flex-1 rounded-xl border-none bg-zinc-100 dark:bg-black/20 p-3 text-center text-lg font-bold text-black dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleAddRoll}
                            disabled={!rollInput}
                            className="flex items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-700 px-4 text-black dark:text-white disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleBust}
                            className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-red-500/50 bg-transparent text-base font-bold text-red-500 transition-colors hover:bg-red-500/10"
                        >
                            Perdió (0)
                        </button>
                        <button
                            onClick={handleBank}
                            className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary text-base font-bold text-black transition-opacity hover:opacity-90"
                        >
                            Plantarse
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
