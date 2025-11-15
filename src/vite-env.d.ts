/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'figma:assets/*' {
    const assetUrl: string;
    export default assetUrl;
  }
  