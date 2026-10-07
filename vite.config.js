import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
            manifest: {
                name: 'Anotador · Generala, Truco y 10.000',
                short_name: 'Anotador',
                description: 'Anotador de puntos para Generala, Truco y 10.000. Funciona sin conexión.',
                lang: 'es',
                theme_color: '#102216',
                background_color: '#102216',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
                // Accesos directos al mantener presionado el ícono de la app
                shortcuts: [
                    {
                        name: 'Generala',
                        short_name: 'Generala',
                        url: '/generala',
                        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
                    },
                    {
                        name: 'Truco',
                        short_name: 'Truco',
                        url: '/truco',
                        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
                    },
                    {
                        name: '10.000',
                        short_name: '10.000',
                        url: '/10000',
                        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,woff2}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true
            }
        })
    ],
})
