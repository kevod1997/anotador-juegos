import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, CircleHelp, Dices, Play, Volume2, VolumeX } from 'lucide-react';
import InstallPWA from '../components/InstallPWA';
import IconButton from '../components/IconButton';
import GeneralaArt from '../components/art/GeneralaArt';
import TenThousandArt from '../components/art/TenThousandArt';
import { gameSummaries } from '../lib/summaries';
import { feedback, setSoundEnabled, useSettings } from '../lib/feedback';

const GAMES = [
    {
        key: 'generala',
        to: '/generala',
        title: 'La Generala',
        description: 'El clásico juego de estrategia y suerte.',
        art: <GeneralaArt className="absolute inset-0 h-full w-full" />,
    },
    {
        key: 'truco',
        to: '/truco',
        title: 'Truco',
        description: 'Anotador de truco (a 15 o 30 puntos).',
        art: (
            <img
                src="/assets/truco_cards_home_bg.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
                decoding="async"
            />
        ),
    },
    {
        key: 'tenThousand',
        to: '/10000',
        title: 'El 10.000',
        description: 'Carrera por llegar a los 10.000 puntos.',
        art: <TenThousandArt className="absolute inset-0 h-full w-full" />,
    },
];

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
};

function GameCard({ game, summary }) {
    return (
        <motion.div variants={itemVariants}>
            <Link
                to={game.to}
                onClick={() => feedback('tap')}
                className="group relative block h-44 overflow-hidden rounded-3xl shadow-card ring-1 ring-white/10 transition-transform duration-200 active:scale-[0.98]"
            >
                {game.art}
                <div className="absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/60 via-45% to-transparent to-80%" />

                {summary && (
                    <div className="absolute left-3 top-3 flex max-w-[85%] items-center gap-2 rounded-full bg-ink/70 py-1 pl-2 pr-3 text-xs font-semibold text-white/90 ring-1 ring-white/10 backdrop-blur">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                            <span className="relative inline-flex size-2 rounded-full bg-primary" />
                        </span>
                        <span className="truncate">{summary}</span>
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-extrabold leading-tight tracking-tight">{game.title}</h2>
                        <p className="line-clamp-2 text-sm leading-snug text-white/70">{game.description}</p>
                    </div>
                    <span
                        aria-label={summary ? 'Continuar' : 'Jugar'}
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-background-dark shadow-glow transition-transform group-active:scale-90"
                    >
                        {summary ? <ChevronRight size={24} strokeWidth={2.75} /> : <Play size={20} strokeWidth={2.5} className="ml-0.5 fill-current" />}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

export default function Home() {
    const summaries = useMemo(gameSummaries, []);
    const { sound } = useSettings();

    return (
        <>
            <header className="flex items-center gap-3 px-4 pb-2 pt-safe">
                <div className="flex flex-1 items-center gap-3 pt-5">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-background-dark shadow-glow">
                        <Dices size={24} strokeWidth={2.25} />
                    </span>
                    <div>
                        <h1 className="text-2xl font-extrabold leading-none tracking-tight">Anotador</h1>
                        <p className="mt-1 text-sm font-medium text-white/50">Elige tu juego</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 pt-5">
                    <IconButton
                        label={sound ? 'Silenciar sonidos' : 'Activar sonidos'}
                        className="bg-white/[0.06]"
                        onClick={() => {
                            setSoundEnabled(!sound);
                            if (!sound) feedback('tap');
                        }}
                    >
                        {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </IconButton>
                    <Link
                        to="/rules"
                        aria-label="Reglas y ayuda"
                        className="flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white/80 transition active:scale-90 active:bg-white/10"
                    >
                        <CircleHelp size={20} />
                    </Link>
                </div>
            </header>

            <motion.main
                className="flex flex-1 flex-col gap-4 p-4 pb-safe-4"
                variants={listVariants}
                initial="hidden"
                animate="show"
            >
                {GAMES.map((game) => (
                    <GameCard key={game.key} game={game} summary={summaries[game.key]} />
                ))}
                <motion.div variants={itemVariants} className="mt-2">
                    <InstallPWA />
                </motion.div>
            </motion.main>
        </>
    );
}
