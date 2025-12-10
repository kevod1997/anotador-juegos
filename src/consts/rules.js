// Helper to generate numeric options (e.g., 1s: 1,2,3,4,5)
const combine = (val, max) => Array.from({ length: max }, (_, i) => (i + 1) * val);

export const GENERALA_CATEGORIES = [
    {
        id: '1',
        label: '1',
        options: combine(1, 5),
        calculate: (dice) => dice.filter(d => d === 1).length * 1
    },
    {
        id: '2',
        label: '2',
        options: combine(2, 5),
        calculate: (dice) => dice.filter(d => d === 2).length * 2
    },
    {
        id: '3',
        label: '3',
        options: combine(3, 5),
        calculate: (dice) => dice.filter(d => d === 3).length * 3
    },
    {
        id: '4',
        label: '4',
        options: combine(4, 5),
        calculate: (dice) => dice.filter(d => d === 4).length * 4
    },
    {
        id: '5',
        label: '5',
        options: combine(5, 5),
        calculate: (dice) => dice.filter(d => d === 5).length * 5
    },
    {
        id: '6',
        label: '6',
        options: combine(6, 5),
        calculate: (dice) => dice.filter(d => d === 6).length * 6
    },
    {
        id: 'escalera',
        label: 'Escalera',
        points: 20,
        served: 25,
        options: [20, 25]
    },
    {
        id: 'full',
        label: 'Full',
        points: 30,
        served: 35,
        options: [30, 35]
    },
    {
        id: 'poker',
        label: 'Poker',
        points: 40,
        served: 45,
        options: [40, 45]
    },
    {
        id: 'generala',
        label: 'Generala',
        points: 50,
        served: 'GANA',
        options: [50, 'GANA']
    },
    {
        id: 'doble_generala',
        label: 'Doble G.',
        points: 100,
        options: [100] // No suele ser servida si llegaste aca
    },
];

export const TEN_THOUSAND_COMBINATIONS = [
    { label: 'Cada 1', points: 100 },
    { label: 'Cada 5', points: 50 },
    { label: 'Tres 1s', points: 1000 },
    { label: 'Tres X (no 1)', points: (val) => val * 100 },
    { label: 'Escalera', points: 500 },
    { label: 'Cinco iguales', points: 10000 },
];
