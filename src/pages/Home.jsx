import React from 'react';
import { Link } from 'react-router-dom';
import InstallPWA from '../components/InstallPWA';

export default function Home() {
    return (
        <>
            <header className="flex items-center p-4 pb-2 justify-between">
                <div className="flex size-12 shrink-0 items-center justify-start">
                </div>
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-black dark:text-white">Elige tu Juego</h1>
                <div className="flex w-12 items-center justify-end">
                    <Link to="/rules" className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-black dark:text-white">
                        <span className="material-symbols-outlined">help</span>
                    </Link>
                </div>
            </header>

            <main className="flex flex-1 flex-col items-stretch gap-4 p-4">

                {/* Generala Card */}
                <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none @container overflow-hidden">
                    <div className="h-48 w-full bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMOdlmxDI9eD9jkUk6wOoKBt9e8FLod0Jg1XvAMwwS1zwngWtt9VJEUZAAFEx304_uCTGlk_8Y7N0P7a3btEel-VPLe0Ru6MasyOH5jWJIH1X0BrrPdeTcYyNxuReOOi2evseSAjRw1rgSUGiiUcVEySin31cGaAVioH6YlygzjBC5oITF8IAU0F4M1IR0n4W_tOMr6yhKHXWGCRNfhYUiZTOuiF9EqGB4OpKvLkzd23_386H3S0EijcdaDWLNOUCALNqZPPVacbc")' }}>
                    </div>
                    <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                        <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">La Generala</h2>
                        <p className="text-neutral-500 dark:text-white/70 text-base font-normal leading-normal">El clásico juego de estrategia y suerte.</p>
                        <div className="flex items-end gap-3 justify-between pt-2">
                            <Link to="/generala" className="flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal">
                                <span className="truncate">Jugar Generala</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Truco Card */}
                <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none @container overflow-hidden">
                    <div className="h-48 w-full bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: 'url("/assets/truco_cards_home_bg.jpg")' }}>
                    </div>
                    <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                        <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Truco</h2>
                        <p className="text-neutral-500 dark:text-white/70 text-base font-normal leading-normal">Anotador de truco (a 15 o 30 puntos).</p>
                        <div className="flex items-end gap-3 justify-between pt-2">
                            <Link to="/truco" className="flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal">
                                <span className="truncate">Jugar Truco</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 10.000 Card */}
                <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none @container overflow-hidden">
                    <div className="h-48 w-full bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKm6TTNIF7e-UGkg1sBgMnlcDjSB2LVHr0tq3bZFO_TPb1Zf5NVAP124XUKtiSUNFuQw4RFYGM1QeMaHJtkXTyNAhrebimQ9IxM7Zqhz-oFw6owPHYHAJNTv57LalHHBi-COx-6oaHWGZlD4XLPvAjAH-FmPzw05yCsxzraRwhTaAtnAG4REM_PPWahOP1Bkte927p5ILnJWFllEOiRsI1UJfLU4OrdqPoO8nUmbuuUFmjJg4GqV1gB7rPGPRoM2f9QTaE63LrbCE")' }}>
                    </div>
                    <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                        <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">El 10.000</h2>
                        <p className="text-neutral-500 dark:text-white/70 text-base font-normal leading-normal">Carrera por llegar a los 10.000 puntos.</p>
                        <div className="flex items-end gap-3 justify-between pt-2">
                            <Link to="/10000" className="flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal">
                                <span className="truncate">Jugar 10.000</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <InstallPWA />
        </>
    );
}
