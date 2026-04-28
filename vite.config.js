import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/js/ova.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: 'resources/js/app.jsx',
                ova: 'resources/js/ova.jsx',
            }
        }
    },
    server: {
        watch: {
            ignored: [
                '**/public/OVAs/Matematicas/Adicion-Sustraccion/js/jquery-1.10.2.min.js',
                '**/public/OVAs/Matematicas/Adicion-Sustraccion/js/edge.6.0.0.min.js',
                '**/public/OVAs/Matematicas/Adicion-Sustraccion/js/Menuprincipalovas5_edge.js'
            ]
        }
    },
    publicDir: 'public',
});