import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // This allows the service worker to run during 'npm run dev'
        type: 'module', // Required for Vite 6/7 compatibility
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
              // 2. CACHE API DATA using ENV variable
              urlPattern: ({ url }) => url.origin === VITE_API_BASE_URL && url.pathname.startsWith('/api/jsonapi/'),
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
              // 3. CACHE IMAGES using ENV variable
              urlPattern: ({ url }) => url.origin === VITE_API_BASE_URL && url.pathname.includes('/sites/default/files/'),
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
        theme_color: '#0f172a', // Matches your daijex-dark
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
    }),],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Tell Vite it's being accessed via drupal.c4k.in
    hmr: {
      host: 'drupal.c4k.in',
      protocol: 'wss', // Use 'wss' because your Apache is on 443 (SSL)
      clientPort: 443,
    },
    allowedHosts: ['drupal.c4k.in']
  },
})
