import { useCallback, useState } from 'react';
import { STORAGE_KEYS, readStored, writeStored } from './storage';

// Nombres que el dispositivo recuerda, compartidos por la Generala y el 10.000
const MAX_REMEMBERED = 30;
const DEFAULT_NAME = /^Jugador \d+$/i;

const clean = (names) => {
    const seen = new Set();
    return names
        .map((n) => (n || '').trim())
        .filter((n) => {
            const key = n.toLowerCase();
            if (!n || DEFAULT_NAME.test(n) || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
};

const read = () => {
    const stored = readStored(STORAGE_KEYS.roster, {});
    return {
        names: Array.isArray(stored.names) ? stored.names : [],
        lineup: Array.isArray(stored.lineup) ? stored.lineup : [],
    };
};

// names: más recientes primero. lineup: los jugadores de la última partida armada, en orden.
export function useRoster() {
    const [roster, setRoster] = useState(read);

    const save = useCallback((update) => {
        const next = update(read());
        writeStored(STORAGE_KEYS.roster, next);
        setRoster(next);
    }, []);

    const mergeNames = (names, added) => {
        const taken = new Set(added.map((n) => n.toLowerCase()));
        return [...added, ...names.filter((n) => !taken.has(n.toLowerCase()))].slice(0, MAX_REMEMBERED);
    };

    // Al armar una partida: recuerda los nombres y la formación para repetirla
    const rememberLineup = useCallback(
        (names) => {
            const added = clean(names);
            save((r) => ({ names: mergeNames(r.names, added), lineup: added }));
        },
        [save]
    );

    // Al renombrar o sumar un jugador a mitad de partida
    const learn = useCallback(
        (name) => {
            const added = clean([name]);
            if (added.length) save((r) => ({ ...r, names: mergeNames(r.names, added) }));
        },
        [save]
    );

    return { names: roster.names, lineup: roster.lineup, rememberLineup, learn };
}
