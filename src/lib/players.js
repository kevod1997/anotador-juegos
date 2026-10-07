// Colores de avatar: tonos apagados que conviven con el verde de la paleta
const AVATAR_COLORS = [
    { bg: 'bg-emerald-400/15', text: 'text-emerald-300', ring: 'ring-emerald-400/40' },
    { bg: 'bg-amber-400/15', text: 'text-amber-300', ring: 'ring-amber-400/40' },
    { bg: 'bg-sky-400/15', text: 'text-sky-300', ring: 'ring-sky-400/40' },
    { bg: 'bg-rose-400/15', text: 'text-rose-300', ring: 'ring-rose-400/40' },
    { bg: 'bg-violet-400/15', text: 'text-violet-300', ring: 'ring-violet-400/40' },
    { bg: 'bg-teal-400/15', text: 'text-teal-300', ring: 'ring-teal-400/40' },
    { bg: 'bg-orange-400/15', text: 'text-orange-300', ring: 'ring-orange-400/40' },
    { bg: 'bg-fuchsia-400/15', text: 'text-fuchsia-300', ring: 'ring-fuchsia-400/40' },
];

export const avatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

export function initials(name) {
    const words = (name || '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    // "Jugador 3" -> "J3"; "Ana María" -> "AM"; "Kevin" -> "KE"
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

export const newId = () => Math.random().toString(36).slice(2, 9);
