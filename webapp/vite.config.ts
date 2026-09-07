import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {VitePWA} from "vite-plugin-pwa";

/**
 * Where the app is served from. "/" locally; GitHub Pages serves under the repo name, which the
 * deploy workflow passes in. `start_url` and `scope` below must follow it or the installed PWA
 * opens the wrong URL.
 */
const base = process.env["BASE_PATH"] ?? "/";

export default defineConfig({
  base,
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Janggi",
        short_name: "Janggi",
        description: "Korean Chess",
        lang: "en",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait",
        background_color: "#f5e6c8",
        theme_color: "#8b5a2b",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
