import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/js/ova.jsx',   // entry point sin Tailwind para las OVAs
            ],
            refresh: true,
        }),
        react(),
    ],
    server: {
        // Ignorar archivos de Edge Animate en watch para evitar recargas innecesarias
        watch: {
            ignored: ['**/public/js/jquery-1.10.2.min.js', '**/public/OVAs/Matematicas/Adicion-Sustraccion/js/edge.6.0.0.min.js', '**/public/OVAs/Matematicas/Adicion-Sustraccion/js/Menuprincipalovas5_edge.js']
        }
    },
    // Asegurar que los assets estáticos se sirvan correctamente
    publicDir: 'public',
});