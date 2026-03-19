import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Helper to escape regex characters in the base URL (like dots or slashes)
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const VITE_API_BASE_URL = env.VITE_API_BASE_URL || '';
  
  // Create safe regex strings based on your env variable
  const safeBaseUrl = escapeRegExp(VITE_API_BASE_URL);

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true, 
          type: 'module', 
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              // 1. CACHE ALL PAGES (Navigation)
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'daijex-pages-cache',
                expiration: { maxEntries: 50 },
              },
            },
            {
              // 2. CACHE API DATA using RegExp
              // Matches the base URL + /api/jsonapi/
              urlPattern: new RegExp(`^${safeBaseUrl}/api/jsonapi/.*`, 'i'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'daijex-api-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // 3. CACHE IMAGES using RegExp
              // Matches the base URL + /api/sites/default/files/
              urlPattern: new RegExp(`^${safeBaseUrl}/api/sites/default/files/.*`, 'i'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'daijex-image-cache',
                expiration: { 
                  maxEntries: 500, 
                  maxAgeSeconds: 60 * 60 * 24 * 30 
                },
              },
            }
          ],
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Daijex Automotive',
          short_name: 'Daijex',
          description: 'Premium Car Accessories & Spoilers',
          theme_color: '#0f172a',
          background_color: '#ffffff',
          display: 'standalone',
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
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        host: 'drupal.c4k.in',
        protocol: 'wss',
        clientPort: 443,
      },
      allowedHosts: ['drupal.c4k.in']
    },
  };
});