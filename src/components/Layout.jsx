import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();

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
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-black dark:text-white">
            <Outlet />

            {/* Example PWA Reload Prompt could go here */}
        </div>
    );
}
