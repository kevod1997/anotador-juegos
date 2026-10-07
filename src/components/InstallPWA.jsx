import React, { useEffect, useState } from 'react';
import { Download, Share, SquarePlus, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import BottomSheet from './BottomSheet';
import Button from './Button';

const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [installed, setInstalled] = useState(isStandalone);
    const ios = isIOS();

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };
        const onInstalled = () => setInstalled(true);

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (ios) {
            setShowIOSGuide(true);
            return;
        }
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    if (installed || (!ios && !deferredPrompt)) return null;

    return (
        <>
            <motion.button
                onClick={handleInstallClick}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="surface-card flex w-full items-center gap-4 rounded-3xl p-4 text-left transition active:scale-[0.98]"
            >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Download size={22} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block font-bold">Instalá la app</span>
                    <span className="block text-sm text-white/55">Abrila desde tu inicio y usala sin conexión.</span>
                </span>
            </motion.button>

            <BottomSheet
                open={showIOSGuide}
                onClose={() => setShowIOSGuide(false)}
                title="Instalar en iPhone"
                subtitle="Safari no muestra un botón de instalación"
                icon={
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <Smartphone size={20} />
                    </span>
                }
            >
                <ol className="mb-6 space-y-3">
                    {[
                        { icon: <Share size={20} />, text: <>Tocá <b>Compartir</b> en la barra de Safari.</> },
                        { icon: <SquarePlus size={20} />, text: <>Elegí <b>Agregar a inicio</b>.</> },
                        { icon: <Download size={20} />, text: <>Confirmá con <b>Agregar</b>. ¡Listo, funciona sin conexión!</> },
                    ].map((step, i) => (
                        <li key={i} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-primary">
                                {step.icon}
                            </span>
                            <span className="text-[15px] text-white/80">{step.text}</span>
                        </li>
                    ))}
                </ol>
                <Button className="w-full" onClick={() => setShowIOSGuide(false)}>Entendido</Button>
            </BottomSheet>
        </>
    );
};

export default InstallPWA;
