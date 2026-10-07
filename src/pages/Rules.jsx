import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { cn } from '../lib/cn';

const generalaRules = [
    {
        title: 'Objetivo',
        content: 'Obtener la mayor puntuación posible al sumar los números y los juegos mayores al finalizar las rondas.'
    },
    {
        title: 'Juego',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li>La partida se desarrolla en <strong>11 rondas</strong>.</li>
                <li>Cada jugador tiene un turno por ronda con <strong>3 tiros</strong>.</li>
                <li>Puedes conservar dados y volver a tirar el resto.</li>
                <li>Debes elegir una categoría para anotar o tachar (0 puntos) si no logras ninguna.</li>
            </ul>
        )
    },
    {
        title: 'Jugadas',
        content: (
            <div className="space-y-2">
                <p><strong>Por Número (1-6):</strong> Suma de los dados con ese número.</p>
                <p><strong>Juegos Mayores:</strong></p>
                <ul className="list-disc space-y-1 pl-5">
                    <li><strong>Escalera (20 pts):</strong> 1-2-3-4-5 ó 2-3-4-5-6</li>
                    <li><strong>Full (30 pts):</strong> 3 de un número y 2 de otro</li>
                    <li><strong>Póker (40 pts):</strong> 4 dados iguales</li>
                    <li><strong>Generala (50 pts):</strong> 5 dados iguales</li>
                    <li><strong>Doble Generala:</strong> Segunda Generala (Gana o 100 pts)</li>
                </ul>
            </div>
        )
    },
    {
        title: 'Reglas Especiales',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li><strong>Juego Servido:</strong> +5 puntos si se logra en el primer tiro (excepto Generala).</li>
                <li><strong>Generala Servida:</strong> Gana automáticamente la partida.</li>
            </ul>
        )
    }
];

const trucoRules = [
    {
        title: 'Objetivo',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li>Gana el primer equipo en llegar a <strong>30 puntos</strong> (15 malas y 15 buenas).</li>
                <li>En partidas cortas se juega <strong>a 15</strong>.</li>
                <li>Los puntos se anotan con fósforos: cada cuadro con su diagonal vale 5.</li>
            </ul>
        )
    },
    {
        title: 'Envido',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li><strong>Envido:</strong> 2 puntos.</li>
                <li><strong>Real envido:</strong> 3 puntos.</li>
                <li><strong>Falta envido:</strong> los puntos que le faltan al que va ganando para terminar la partida.</li>
                <li>Los cantos se suman (ej: envido + real envido = 5). Si no se quiere, el que cantó suma <strong>1 punto</strong> o lo acumulado antes del último canto.</li>
            </ul>
        )
    },
    {
        title: 'Truco',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li><strong>Truco:</strong> 2 puntos. <strong>Retruco:</strong> 3 puntos. <strong>Vale cuatro:</strong> 4 puntos.</li>
                <li>Si no se quiere, el que cantó suma lo que valía la mano antes del canto (truco no querido = 1).</li>
                <li>Sin cantos, la mano vale <strong>1 punto</strong>.</li>
            </ul>
        )
    },
    {
        title: 'En el anotador',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li>Tocá la columna de un equipo para sumar 1 punto.</li>
                <li>Usá <strong>+2</strong>, <strong>+3</strong> y <strong>+4</strong> para truco, retruco, vale cuatro y envidos.</li>
                <li>Si te equivocás, el botón de deshacer revierte la última anotación.</li>
            </ul>
        )
    }
];

const tenThousandRules = [
    {
        title: 'Objetivo',
        content: 'Ser el primer jugador en alcanzar un total exacto o superior a 10.000 puntos.'
    },
    {
        title: 'Juego',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li>Se necesitan un 1, un 5, tres iguales o escalera para sumar.</li>
                <li><strong>Plantarse:</strong> Anota puntos acumulados y pasa el turno.</li>
                <li><strong>Seguir:</strong> Arriesga los puntos acumulados para sumar más. Si fallas, pierdes todo lo del turno.</li>
                <li>Si usas los 5 dados, puedes volver a tirar todos acumulando en el mismo turno.</li>
            </ul>
        )
    },
    {
        title: 'Jugadas',
        content: (
            <ul className="list-disc space-y-1 pl-5">
                <li><strong>Cada 1:</strong> 100 puntos</li>
                <li><strong>Cada 5:</strong> 50 puntos</li>
                <li><strong>Tres iguales:</strong> Valor x 100 (Tres 1 = 1000)</li>
                <li><strong>Escalera:</strong> 500 puntos</li>
                <li><strong>Cinco iguales:</strong> 10.000 puntos (Gana)</li>
            </ul>
        )
    }
];

const TABS = [
    { id: 'generala', label: 'Generala', rules: generalaRules },
    { id: 'truco', label: 'Truco', rules: trucoRules },
    { id: '10000', label: '10.000', rules: tenThousandRules },
];

function Section({ title, open, onToggle, children }) {
    return (
        <div className="surface-card overflow-hidden rounded-2xl">
            <button className="flex w-full items-center justify-between p-4 text-left" onClick={onToggle} aria-expanded={open}>
                <span className="font-bold">{title}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-primary">
                    <ChevronDown size={20} />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="px-4 pb-4 text-[15px] leading-relaxed text-white/75">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Rules() {
    const [activeTab, setActiveTab] = useState('generala');
    // Secciones abiertas por pestaña ("Objetivo" abierta por defecto)
    const [openSections, setOpenSections] = useState({});

    const tab = TABS.find((t) => t.id === activeTab);
    const isOpen = (title) => openSections[`${activeTab}:${title}`] ?? title === 'Objetivo';
    const toggleSection = (title) =>
        setOpenSections((prev) => ({ ...prev, [`${activeTab}:${title}`]: !isOpen(title) }));

    return (
        <div className="flex min-h-[100dvh] flex-col">
            <AppHeader title="Reglas y ayuda" />

            {/* Pestañas */}
            <div className="px-4 pt-4">
                <div className="flex rounded-2xl bg-white/[0.05] p-1 ring-1 ring-inset ring-white/5">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={cn(
                                'relative h-10 flex-1 rounded-xl text-sm font-bold transition-colors',
                                activeTab === t.id ? 'text-background-dark' : 'text-white/60'
                            )}
                        >
                            {activeTab === t.id && (
                                <motion.span
                                    layoutId="rules-tab"
                                    className="absolute inset-0 rounded-xl bg-primary shadow-glow"
                                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                                />
                            )}
                            <span className="relative">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 space-y-3 p-4 pb-safe-4"
                >
                    {tab.rules.map((section) => (
                        <Section
                            key={section.title}
                            title={section.title}
                            open={isOpen(section.title)}
                            onToggle={() => toggleSection(section.title)}
                        >
                            {section.content}
                        </Section>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
