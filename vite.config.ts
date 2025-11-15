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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Sauna Journal',
        short_name: 'Sauna',
        description: 'Track your sauna sessions and wellness journey',
        theme_color: '#3E2723',
        background_color: '#FFEBCD',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ]
})

