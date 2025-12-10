import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Rules() {
    const [activeTab, setActiveTab] = useState('generala');

    // Accordion state - object with keys as section titles
    // Keys must match the titles in the rules arrays below
    const [openSections, setOpenSections] = useState({
        'Objetivo': true,
        'Juego': false,
        'Jugadas': false,
        'Reglas Especiales': false,
        'Ganador': false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const generalaRules = [
        {
            title: 'Objetivo',
            content: 'Obtener la mayor puntuación posible al sumar los números y los juegos mayores al finalizar las rondas.'
        },
        {
            title: 'Juego',
            content: (
                <ul className="list-disc pl-5 space-y-1">
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
                    <ul className="list-disc pl-5 space-y-1">
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
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Juego Servido:</strong> +5 puntos si se logra en el primer tiro (excepto Generala).</li>
                    <li><strong>Generala Servida:</strong> Gana automáticamente la partida.</li>
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
                <ul className="list-disc pl-5 space-y-1">
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
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Cada 1:</strong> 100 puntos</li>
                    <li><strong>Cada 5:</strong> 50 puntos</li>
                    <li><strong>Tres iguales:</strong> Valor x 100 (Tres 1 = 1000)</li>
                    <li><strong>Escalera:</strong> 500 puntos</li>
                    <li><strong>Cinco iguales:</strong> 10.000 puntos (Gana)</li>
                </ul>
            )
        }
    ];

    const currentRules = activeTab === 'generala' ? generalaRules : tenThousandRules;

    return (
        <div className="flex flex-col h-screen bg-[#111411] text-white overflow-hidden font-sans">
            {/* Header */}
            <header className="flex items-center p-4">
                <Link to="/" className="flex items-center justify-center p-2 -ml-2 text-white cursor-pointer">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
                </Link>
                <h1 className="flex-1 text-center text-xl font-bold mr-8">Reglas y Ayuda</h1>
            </header>

            {/* Tabs */}
            <div className="flex w-full border-b border-white/10 relative">
                <button
                    className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${activeTab === 'generala' ? 'text-white' : 'text-white/50'}`}
                    onClick={() => setActiveTab('generala')}
                >
                    La Generala
                </button>
                <button
                    className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${activeTab === '10000' ? 'text-white' : 'text-white/50'}`}
                    onClick={() => setActiveTab('10000')}
                >
                    10.000
                </button>

                {/* Active Tab Indicator */}
                <div
                    className="absolute bottom-0 h-1 bg-[#4cef78] transition-all duration-300 ease-in-out"
                    style={{
                        left: activeTab === 'generala' ? '0%' : '50%',
                        width: '50%'
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentRules.map((section, index) => (
                    <div
                        key={index}
                        className="rounded-xl bg-[#1c211c] border border-white/5 overflow-hidden transition-all duration-200"
                    >
                        <button
                            className="w-full flex items-center justify-between p-4 text-left"
                            onClick={() => toggleSection(section.title)}
                        >
                            <span className="font-medium">{section.title}</span>
                            <span
                                className={`material-symbols-outlined text-[#4cef78] transition-transform duration-200 ${openSections[section.title] ? 'rotate-180' : ''}`}
                            >
                                expand_more
                            </span>
                        </button>

                        <div
                            className={`transition-all duration-200 ease-in-out overflow-hidden ${openSections[section.title] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-4 pt-0 text-white/80 text-sm leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
