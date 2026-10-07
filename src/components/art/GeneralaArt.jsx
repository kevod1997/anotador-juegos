import React from 'react';
import Felt from './Felt';
import Die from './Die';

// Cinco dados iguales: la Generala
export default function GeneralaArt({ className }) {
    return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
            <Felt id="gen" />
            <circle cx="290" cy="60" r="110" fill="#2bee6c" opacity="0.07" />
            <Die x={196} y={58} size={44} rotate={-14} value={6} />
            <Die x={252} y={40} size={48} rotate={8} value={6} />
            <Die x={312} y={54} size={46} rotate={-4} value={6} />
            <Die x={366} y={34} size={42} rotate={16} value={6} />
            <Die x={276} y={100} size={40} rotate={-22} value={6} />
        </svg>
    );
}
