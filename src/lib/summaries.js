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

    const carioca = readStored(STORAGE_KEYS.carioca);
    if (carioca?.hands?.length > 0 && carioca.players?.length > 0) {
        const total = (p) => carioca.hands.reduce((sum, h) => sum + (h.scores[p.id] ?? 0), 0);
        const leader = [...carioca.players].sort((a, b) => total(a) - total(b))[0];
        summaries.carioca =
            carioca.hands.length >= 7
                ? `Terminada · Ganó ${leader.name}`
                : `Mano ${carioca.hands.length + 1}/7 · Lidera ${leader.name} · ${fmt(total(leader))}`;
    }

    return summaries;
}
