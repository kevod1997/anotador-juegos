import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

const depthOf = (path) => (path === '/' ? 0 : 1);

// Cada pantalla arranca arriba de todo, antes de pintarse
function ScrollToTop() {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return null;
}

const variants = {
    enter: (dir) => ({ opacity: 0, x: dir * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -32 }),
};

export default function Layout() {
    const location = useLocation();
    const outlet = useOutlet();

    // Dirección de la transición: entrar a un juego desliza hacia la izquierda, volver hacia la derecha
    const nav = useRef({ path: location.pathname, dir: 1 });
    if (nav.current.path !== location.pathname) {
        const dir = depthOf(location.pathname) >= depthOf(nav.current.path) ? 1 : -1;
        nav.current = { path: location.pathname, dir };
    }
    const { dir } = nav.current;

    useEffect(() => {
        // Allow pull-to-refresh (auto) ONLY on home page ('/')
        // Disable it (contain) on all other pages (games)
        if (location.pathname === '/') {
            document.body.style.overscrollBehaviorY = 'auto';
        } else {
            document.body.style.overscrollBehaviorY = 'contain';
        }

        // Cleanup: reset when component unmounts (though Layout rarely unmounts in this app)
        return () => {
            document.body.style.overscrollBehaviorY = 'auto';
        };
    }, [location.pathname]);

    return (
        <div className="relative flex min-h-[100dvh] w-full flex-col font-display text-white">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                    key={location.pathname}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col"
                >
                    <ScrollToTop />
                    {outlet}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
