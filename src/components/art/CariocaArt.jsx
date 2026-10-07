import React from 'react';
import Felt from './Felt';

const RED = '#dc2626';
const BLACK = '#102216';
const SUITS = { h: { glyph: '♥', color: RED }, d: { glyph: '♦', color: RED }, s: { glyph: '♠', color: BLACK }, c: { glyph: '♣', color: BLACK } };

// Naipe francés simple: valor y palo en la esquina, palo grande al centro
function Card({ x, y, rotate = 0, rank, suit, w = 50, h = 72 }) {
    const { glyph, color } = SUITS[suit];
    return (
        <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
            <rect x={-w / 2 + 2} y={-h / 2 + 4} width={w} height={h} rx="6" fill="#000" opacity="0.35" />
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill="#f6f3ea" stroke="#c9c2b0" strokeWidth="1" />
            <g fontFamily="'Plus Jakarta Sans Variable', sans-serif" fontWeight="800" fill={color}>
                <text x={-w / 2 + 6} y={-h / 2 + 16} fontSize="14">{rank}</text>
                <text x={-w / 2 + 6} y={-h / 2 + 28} fontSize="11">{glyph}</text>
                <text x="0" y="12" fontSize="30" textAnchor="middle">{glyph}</text>
            </g>
        </g>
    );
}

// Una pierna (tres 7) y una escalera bajadas sobre el paño
export default function CariocaArt({ className }) {
    return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
            <Felt id="carioca" />
            <Card x={176} y={76} rotate={-16} rank="7" suit="s" />
            <Card x={204} y={70} rotate={-4} rank="7" suit="h" />
            <Card x={232} y={74} rotate={8} rank="7" suit="c" />
            <Card x={292} y={96} rotate={-8} rank="4" suit="d" />
            <Card x={318} y={92} rotate={0} rank="5" suit="d" />
            <Card x={344} y={92} rotate={6} rank="6" suit="d" />
            <Card x={370} y={98} rotate={12} rank="7" suit="d" />
        </svg>
    );
}
