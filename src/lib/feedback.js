import { useSyncExternalStore } from 'react';
import { STORAGE_KEYS, readStored, writeStored } from './storage';

// --- Ajustes (sonido) compartidos entre pantallas ---
let settings = { sound: true, ...readStored(STORAGE_KEYS.settings, {}) };
const listeners = new Set();

export function setSoundEnabled(sound) {
    settings = { ...settings, sound };
    writeStored(STORAGE_KEYS.settings, settings);
    listeners.forEach((l) => l());
}

export function useSettings() {
    return useSyncExternalStore(
        (l) => {
            listeners.add(l);
            return () => listeners.delete(l);
        },
        () => settings
    );
}

// --- Sonidos sintetizados (sin archivos, funcionan offline) ---
let ctx = null;
function audio() {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

function tone(freq, { start = 0, duration = 0.08, type = 'sine', gain = 0.06, to } = {}) {
    const ac = audio();
    if (!ac) return;
    const t = ac.currentTime + start;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
}

const SOUNDS = {
    tap: () => tone(700, { duration: 0.04, gain: 0.03 }),
    score: () => {
        tone(660, { duration: 0.07, type: 'triangle' });
        tone(990, { start: 0.06, duration: 0.09, type: 'triangle' });
    },
    undo: () => tone(520, { duration: 0.12, type: 'triangle', to: 330 }),
    bust: () => tone(240, { duration: 0.22, type: 'sawtooth', gain: 0.035, to: 120 }),
    win: () => {
        [523, 659, 784, 1047].forEach((f, i) =>
            tone(f, { start: i * 0.11, duration: 0.22, type: 'triangle', gain: 0.07 })
        );
    },
};

const VIBRATIONS = {
    tap: 8,
    score: 14,
    undo: [10, 40, 10],
    bust: [40, 30, 40],
    win: [30, 60, 30, 60, 80],
};

export function feedback(kind) {
    // Sin interacción previa el navegador bloquea audio y vibración (ej: ganador al recargar)
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try {
        if (settings.sound) SOUNDS[kind]?.();
        if (navigator.vibrate) navigator.vibrate(VIBRATIONS[kind] ?? 8);
    } catch {
        // Nunca romper la interacción por un efecto
    }
}
