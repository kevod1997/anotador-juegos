import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

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

    if (!offlineReady && !needRefresh)
        return null

    const message = offlineReady
        ? 'App lista para trabajar sin conexión (offline)'
        : 'Nueva versión disponible, click para actualizar';

    return (
        <div className="fixed bottom-0 right-0 p-4 m-4 z-[100]">
            <div className="bg-background-dark text-primary border border-primary/20 rounded-lg shadow-2xl p-4 flex flex-col gap-3 max-w-[300px]">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">
                        {offlineReady ? 'wifi_off' : 'system_update'}
                    </span>
                    <span className="text-sm font-medium text-white/90">
                        {message}
                    </span>
                </div>

                <div className="flex gap-2 justify-end mt-1">
                    {needRefresh && (
                        <button
                            className="px-3 py-1.5 bg-primary text-background-dark text-xs font-bold rounded hover:bg-opacity-90 transition-colors"
                            onClick={() => updateServiceWorker(true)}
                        >
                            ACTUALIZAR
                        </button>
                    )}
                    <button
                        className="px-3 py-1.5 text-white/70 hover:text-white text-xs font-medium transition-colors"
                        onClick={close}
                    >
                        CERRAR
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReloadPrompt
