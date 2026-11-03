import type {Plugin} from "vite";
import {VitePWA} from "vite-plugin-pwa";

/**
 * What makes the game installable and playable offline: the manifest, and the service worker in `src/sw/` that
 * precaches the build. `base` is where the app is served from, and `start_url` and `scope` must follow it or the
 * installed PWA opens the wrong URL.
 */
export function installableApp(base: string): Plugin[] {
  return VitePWA({
    injectRegister: false,
    registerType: "prompt",
    strategies: "injectManifest",
    srcDir: "src/sw",
    filename: "ServiceWorker.ts",
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,svg,wasm,txt}", "**/AUTHORS"],
      // The engine's wasm is about 1.6 MB, over Workbox's 2 MB default only with room to spare — raised
      // so a later engine release does not silently drop out of the offline cache.
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
    },
    includeAssets: ["icon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "maskable-icon-512.png"],
    manifest: {
      id: base,
      name: "Janggi",
      short_name: "Janggi",
      description: "Play Janggi (Korean chess) online with a friend, or against the AI. Installs and works offline.",
      lang: "en",
      dir: "ltr",
      start_url: base,
      scope: base,
      display: "standalone",
      orientation: "portrait",
      background_color: "#f5e6c8",
      theme_color: "#8b5a2b",
      icons: [
        {
          src: "icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "maskable-icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      screenshots: [
        {
          src: "janggi-korean-chess.png",
          sizes: "1200x630",
          type: "image/png",
          form_factor: "wide",
          label: "A Janggi game against the computer",
        },
      ],
      shortcuts: [
        {
          name: "Learn to play Janggi",
          short_name: "Learn",
          description: "Read the board, pieces and rules of Janggi.",
          url: `${base}learn.html`,
          icons: [{src: "icon-192.png", sizes: "192x192", type: "image/png"}],
        },
      ],
      categories: ["games", "entertainment"],
    },
  });
}
