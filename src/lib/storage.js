import { useEffect, useState } from 'react';

const PREFIX = 'anotador:';

export const STORAGE_KEYS = {
    generala: `${PREFIX}generala`,
    truco: `${PREFIX}truco`,
    tenThousand: `${PREFIX}10000`,
    settings: `${PREFIX}settings`,
};

export function readStored(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function writeStored(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Almacenamiento lleno o bloqueado: la app sigue funcionando sin guardar
    }
}

// Estado de React que se guarda en el dispositivo y sobrevive a recargas
export function usePersistentState(key, initial) {
    const [state, setState] = useState(() => {
        const stored = readStored(key);
        if (stored !== null) return stored;
        return typeof initial === 'function' ? initial() : initial;
    });

    useEffect(() => {
        writeStored(key, state);
    }, [key, state]);

    return [state, setState];
}
