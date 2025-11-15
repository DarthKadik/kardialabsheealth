import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


/**
 * A custom Vite plugin to automatically remove version specifiers from import statements.
 * For example:
 *   import { Slot } from "@radix-ui/react-slot@1.1.2";
 * becomes:
 *   import { Slot } from "@radix-ui/react-slot";
 */

function removeVersionSpecifiers(): Plugin {
  const VERSION_PATTERN = /@\d+\.\d+\.\d+/;

  return {
    name: 'remove-version-specifiers',

    resolveId(id: string, importer) {
      if (VERSION_PATTERN.test(id)) {
        const cleanId= id.replace(VERSION_PATTERN, '');
        return this.resolve(cleanId, importer, { skipSelf: true });
      }
      return null;
    },
  }
}


/**
 * A custom Vite plugin to resolve imports with the "figma:assets/" prefix.
 */
function figmaAssetsResolver(): Plugin {
  const FIGMA_ASSETS_PREFIX = 'figma:asset/';

  return {
    name: 'figma-assets-resolver',

    resolveId(id: string) {
      if (id.startsWith(FIGMA_ASSETS_PREFIX)) {
        const assetPath = id.substring(FIGMA_ASSETS_PREFIX.length);
        return path.resolve(__dirname, './src/assets', assetPath);
      }
      return null;
    },
  };
}


const produceSingleFile = process.env.SINGLE_FILE === 'true'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    react(), 
    tailwindcss(), 
    figmaAssetsResolver(), 
    removeVersionSpecifiers(), 
    ...(produceSingleFile ? [viteSingleFile()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offlineCache',
              expiration: {
                maxEntries: 200,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Sauna Journal',
        short_name: 'Sauna',
        description: 'Track your sauna sessions and wellness journey',
        id: '/?source=pwa', // Make the ID more unique
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#3E2723',
        background_color: '#FFEBCD',
        icons: [
          {
            src: '/pwa-192x192.png', // Add leading slash
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png', // Add leading slash
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png', // Add leading slash
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})

