import React, { useEffect, useRef } from 'react';
import { motion, useAnimate, useSpring, useTransform } from 'motion/react';

const defaultFormat = (n) => n.toLocaleString('es-AR');

// Número que "cuenta" hasta el nuevo valor y hace un pequeño pop al cambiar
export default function AnimatedNumber({ value, format = defaultFormat, className, pop = true }) {
    const spring = useSpring(value, { stiffness: 260, damping: 30 });
    const display = useTransform(spring, (v) => format(Math.round(v)));
    const [scope, animate] = useAnimate();
    const previous = useRef(value);

    useEffect(() => {
        spring.set(value);
        if (pop && previous.current !== value && scope.current) {
            animate(scope.current, { scale: [1.18, 1] }, { type: 'spring', stiffness: 500, damping: 18 });
        }
        previous.current = value;
    }, [value, spring, pop, animate, scope]);

    return (
        <motion.span ref={scope} className={className} style={{ display: 'inline-block' }}>
            {display}
        </motion.span>
    );
}
