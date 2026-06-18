import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'offline.html'],
            manifest: {
                name: 'Casa no Azul',
                short_name: 'Casa Azul',
                description: 'Controle financeiro familiar para saber quanto ainda pode gastar.',
                start_url: '/dashboard',
                display: 'standalone',
                background_color: '#0f172a',
                theme_color: '#0f172a',
                lang: 'pt-BR',
                icons: [
                    {
                        src: '/pwa-icon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                navigateFallback: '/offline.html',
                navigateFallbackDenylist: [/^\/h\/.*\/(expenses|subscriptions|goals)/],
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) => request.destination === 'document',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pages',
                        },
                    },
                    {
                        urlPattern: ({ request }) => ['style', 'script', 'font', 'image'].includes(request.destination),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'assets',
                        },
                    },
                ],
            },
        }),
    ],
});
