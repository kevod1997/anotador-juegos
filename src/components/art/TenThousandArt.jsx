import React from 'react';
import Felt from './Felt';
import Die from './Die';

// Una tirada que suma (1-1-1-5-5) y la meta de fondo
export default function TenThousandArt({ className }) {
    return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
            <Felt id="tt" />
            <text
                x="392"
                y="70"
                textAnchor="end"
                fontFamily="'Plus Jakarta Sans Variable', sans-serif"
                fontWeight="800"
                fontSize="72"
                letterSpacing="-3"
                fill="#2bee6c"
                opacity="0.14"
            >
                10.000
            </text>
            <Die x={190} y={72} size={40} rotate={-18} value={1} accentPip="#dc2626" />
            <Die x={240} y={58} size={44} rotate={6} value={1} accentPip="#dc2626" />
            <Die x={292} y={78} size={42} rotate={-8} value={1} accentPip="#dc2626" />
            <Die x={344} y={60} size={40} rotate={14} value={5} />
            <Die x={318} y={122} size={36} rotate={-24} value={5} />
        </svg>
    );
}
