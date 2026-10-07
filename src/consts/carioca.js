// Las 7 manos del Carioca: el contrato a bajar en cada una.
// Se reparten 6 + número de mano cartas (mano 1 = 7 cartas … mano 7 = 13).
export const CARIOCA_HANDS = [
    { label: 'Dos piernas', short: '2 piernas' },
    { label: 'Una pierna y una escalera', short: 'Pierna + esc.' },
    { label: 'Dos escaleras', short: '2 escaleras' },
    { label: 'Tres piernas', short: '3 piernas' },
    { label: 'Dos piernas y una escalera', short: '2 piernas + esc.' },
    { label: 'Dos escaleras y una pierna', short: '2 esc. + pierna' },
    { label: 'Tres escaleras', short: '3 escaleras' },
];

export const CARIOCA_TOTAL_HANDS = CARIOCA_HANDS.length;

// number: 1 a 7
export const cardsForHand = (number) => 6 + number;
