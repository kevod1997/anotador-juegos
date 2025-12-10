import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Simple Match Icon that draws lines incrementally to form a box + diagonal
// 1: |
// 2: |_
// 3: |-| (open box) - actually standard is often: | (left), top, right, right, bottom, diag
// Let's implement the standard sequence: Left, Top, Right, Bottom, Diagonal
const MatchGroup = ({ value }) => {
    // Increased size from w-12 h-12 to w-20 h-20 (approx 80px)
    return (
        <div className="relative w-20 h-20 m-2">
            <svg viewBox="0 0 50 50" className="w-full h-full overflow-visible">
                {/* 1: Left Vertical */}
                {value >= 1 && (
                    <path d="M 10 10 L 10 40" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
                )}

                {/* 2: Top Horizontal */}
                {value >= 2 && (
                    <path d="M 10 10 L 40 10" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
                )}

                {/* 3: Right Vertical */}
                {value >= 3 && (
                    <path d="M 40 10 L 40 40" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
                )}

                {/* 4: Bottom Horizontal */}
                {value >= 4 && (
                    <path d="M 40 40 L 10 40" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
                )}

                {/* 5: Diagonal */}
                {value >= 5 && (
                    <path d="M 10 10 L 40 40" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
                )}

                {/* Heads for realism? Maybe too cluttered. Let's keep it clean lines for "drawing" style or add small dots */}
            </svg>
        </div>
    )
}

const ScoreColumn = ({ name, score, onIncrement, onDecrement, onNameChange, isWinner, limit }) => {
    // Calculate groups of 5
    const groups = [];
    const fullGroups = Math.floor(score / 5);
    const remainder = score % 5;

    for (let i = 0; i < fullGroups; i++) {
        groups.push(5);
    }
    if (remainder > 0) {
        groups.push(remainder);
    }
    // Pad with empty space to keep layout stable if needed, or just let it grow.
    // Fixed height might be better.

    // Prepare slots for the layout to ensure the divider is always in place relative to content?
    // Or just use a fixed absolute divider in the middle of the scroll area?
    // "Always present" and "full width".
    // Let's divide the scrollable area into two sections: Malas and Buenas.
    // Malas: 0-15. Buenas: 16-30.

    // We can render two lists.
    const malasGroups = groups.slice(0, 3); // First 3 groups (5, 10, 15)
    // Actually if score is 17: groups is [5, 5, 5, 2]. Malas gets 3. Buenas gets 1.

    // If we have less than 3 groups, we just render them in Malas.
    // If we have more, the rest go to Buenas.

    const buenasGroups = groups.slice(3);

    return (
        <div className={`flex flex-1 flex-col items-center h-full relative ${isWinner ? 'bg-yellow-500/10' : ''}`}>
            {/* Header */}
            <div className="w-full p-4 flex flex-col items-center gap-2 border-b border-white/10 shrink-0">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="bg-transparent text-center text-xl font-bold text-white outline-none w-full uppercase tracking-wider placeholder-white/50"
                    placeholder="NOMBRE"
                />
                <div className="text-4xl font-bold text-primary tabular-nums">{score}</div>
            </div>

            {/* Matches Container */}
            <div className="flex-1 w-full overflow-y-auto flex flex-col items-center relative no-scrollbar">

                {/* Malas Section - Top Half */}
                <div className="flex flex-col items-center justify-start py-4 gap-2 w-full flex-1 border-b border-white/30">
                    {/* Use flex-col-reverse and justify-end to stack from bottom of this section up?
                           Actually, Malas (0-15) usually go top-down.
                           User wants vertical stack. "de 5 en 5".
                           Let's stick to standard top-down.
                        */}
                    {malasGroups.map((val, idx) => (
                        <MatchGroup key={`m-${idx}`} value={val} />
                    ))}
                </div>

                {/* Buenas Section - Bottom Half */}
                <div className="flex flex-col items-center justify-start py-4 gap-2 w-full flex-1">
                    {buenasGroups.map((val, idx) => (
                        <MatchGroup key={`b-${idx}`} value={val} />
                    ))}
                </div>

            </div>

            {/* Controls */}
            <div className="w-full p-4 grid grid-cols-2 gap-4 mt-auto shrink-0 border-t border-white/10">
                <button
                    onClick={onDecrement}
                    className="flex h-16 items-center justify-center rounded-xl bg-white/5 text-2xl font-bold text-white active:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">remove</span>
                </button>
                <button
                    onClick={onIncrement}
                    className="flex h-16 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-background-dark active:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>
        </div>
    );
};

export default function Truco() {
    const [scoreUs, setScoreUs] = useState(0);
    const [scoreThem, setScoreThem] = useState(0);
    const [nameUs, setNameUs] = useState("NOSOTROS");
    const [nameThem, setNameThem] = useState("ELLOS");

    // Game limit
    const [limit, setLimit] = useState(30); // 15 or 30

    const resetGame = () => {
        if (window.confirm('¿Empezar partida nueva?')) {
            setScoreUs(0);
            setScoreThem(0);
        }
    };

    const handleIncrement = (team) => {
        if (team === 'us' && scoreUs < limit) setScoreUs(s => s + 1);
        if (team === 'them' && scoreThem < limit) setScoreThem(s => s + 1);
    };

    const handleDecrement = (team) => {
        if (team === 'us' && scoreUs > 0) setScoreUs(s => s - 1);
        if (team === 'them' && scoreThem > 0) setScoreThem(s => s - 1);
    };

    return (
        <div className="flex flex-col bg-background-dark text-white h-[100dvh] overflow-hidden">
            {/* Toolbar */}
            <header className="flex h-16 items-center justify-between px-4 border-b border-white/5 bg-background-dark z-10 shrink-0">
                <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10 active:bg-white/20">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold">Anotador de Truco</h1>
                    <button onClick={() => setLimit(l => l === 30 ? 15 : 30)} className="text-xs px-2 py-1 rounded bg-white/10 ml-2">
                        A {limit}
                    </button>
                </div>
                <button onClick={resetGame} className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10 active:bg-white/20">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </header>

            {/* Split Screen */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Vertical Divider */}
                <div className="absolute left-1/2 top-4 bottom-24 w-px bg-white/10 -translate-x-1/2 pointer-events-none"></div>

                <ScoreColumn
                    name={nameUs}
                    score={scoreUs}
                    onIncrement={() => handleIncrement('us')}
                    onDecrement={() => handleDecrement('us')}
                    onNameChange={setNameUs}
                    isWinner={scoreUs >= limit}
                    limit={limit}
                />

                <ScoreColumn
                    name={nameThem}
                    score={scoreThem}
                    onIncrement={() => handleIncrement('them')}
                    onDecrement={() => handleDecrement('them')}
                    onNameChange={setNameThem}
                    isWinner={scoreThem >= limit}
                    limit={limit}
                />
            </div>
        </div>
    );
}
