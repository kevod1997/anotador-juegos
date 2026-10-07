import { useEffect } from 'react';

// Mantiene la pantalla encendida mientras el componente está montado
export function useWakeLock() {
    useEffect(() => {
        if (!('wakeLock' in navigator)) return;
        let sentinel = null;
        let cancelled = false;

        const request = async () => {
            try {
                sentinel = await navigator.wakeLock.request('screen');
                if (cancelled) sentinel.release();
            } catch {
                // Sin permiso o batería baja: se ignora
            }
        };

        const onVisibility = () => {
            if (document.visibilityState === 'visible') request();
        };

        request();
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            cancelled = true;
            document.removeEventListener('visibilitychange', onVisibility);
            sentinel?.release().catch(() => { });
        };
    }, []);
}
