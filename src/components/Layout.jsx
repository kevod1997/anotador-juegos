import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react'; // This might need type declaration adjustment if TS, but JS is fine.

// Actually virtual module might not work without declaration in JS too if IDE complains but runtime it works.
// For now, simpler layout without immediate SW hook logic until necessary.

export default function Layout() {
    // Simple check for now
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-black dark:text-white">
            <Outlet />

            {/* Example PWA Reload Prompt could go here */}
        </div>
    );
}
