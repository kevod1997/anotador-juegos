import { STORAGE_KEYS, readStored } from './storage';

const fmt = (n) => n.toLocaleString('es-AR');

// Resumen corto de la partida guardada de cada juego (o null si no hay una en curso)
export function gameSummaries() {
    const summaries = {};

    const generala = readStored(STORAGE_KEYS.generala);
    if (generala && Object.keys(generala.scores || {}).length > 0) {
        const filled = Object.keys(generala.scores).length;
        const total = generala.players.length * 11;
        summaries.generala = `${generala.players.length} jugadores · ${filled}/${total} casillas`;
    }

    const truco = readStored(STORAGE_KEYS.truco);
    if (truco && truco.us + truco.them > 0) {
        summaries.truco = `${truco.nameUs} ${truco.us} · ${truco.nameThem} ${truco.them}`;
    }

    const tt = readStored(STORAGE_KEYS.tenThousand);
    if (tt && tt.players?.some((p) => p.score > 0)) {
        const leader = [...tt.players].sort((a, b) => b.score - a.score)[0];
        summaries.tenThousand = `Lidera ${leader.name} · ${fmt(leader.score)}`;
    }

    return summaries;
}
