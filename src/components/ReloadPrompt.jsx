import React, { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { AnimatePresence, motion } from 'motion/react'
import { RefreshCw, WifiOff } from 'lucide-react'

function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    // El aviso de "lista offline" es informativo: se oculta solo
    useEffect(() => {
        if (!offlineReady) return
        const t = setTimeout(() => setOfflineReady(false), 3500)
        return () => clearTimeout(t)
    }, [offlineReady, setOfflineReady])

    const visible = offlineReady || needRefresh
    const message = offlineReady
        ? 'Lista para usar sin conexión'
        : 'Hay una nueva versión disponible'

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4"
                    style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
                >
                    <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-primary/20 bg-ink/95 p-3 pl-4 shadow-sheet backdrop-blur">
                        <span className="text-primary">
                            {offlineReady ? <WifiOff size={20} /> : <RefreshCw size={20} />}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-medium text-white/90">{message}</span>
                        {needRefresh && (
                            <button
                                className="h-9 rounded-xl bg-primary px-3 text-sm font-bold text-background-dark transition active:scale-95"
                                onClick={() => updateServiceWorker(true)}
                            >
                                Actualizar
                            </button>
                        )}
                        <button
                            className="h-9 rounded-xl px-3 text-sm font-medium text-white/60 transition active:scale-95 active:bg-white/10"
                            onClick={close}
                        >
                            Cerrar
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ReloadPrompt
