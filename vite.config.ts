import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: [
          'localhost',
          '.clackypaas.com',
          '3000-6075dbbe1390-web.clackypaas.com'
        ],
        hmr: {
          clientPort: 3000,
          host: '3000-6075dbbe1390-web.clackypaas.com'
        }
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icons/*.svg'],
          manifest: {
            name: 'BabyAGI II - Autonomous AI Agent',
            short_name: 'BabyAGI II',
            description: 'State-of-the-art autonomous AI agent framework for task planning, reasoning, and execution',
            theme_color: '#8b5a3c',
            background_color: '#2d2013',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            orientation: 'any',
            icons: [
              {
                src: '/icons/icon-72x72.svg',
                sizes: '72x72',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-96x96.svg',
                sizes: '96x96',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-128x128.svg',
                sizes: '128x128',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-144x144.svg',
                sizes: '144x144',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-152x152.svg',
                sizes: '152x152',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-384x384.svg',
                sizes: '384x384',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icons/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,ico,txt,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/openrouter\.ai\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'openrouter-api',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 // 24 hours
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          },
          devOptions: {
            enabled: true,
            type: 'module',
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
