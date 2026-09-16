import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {createRequire} from "node:module";
import {defineConfig} from "vite";
import type {Plugin} from "vite";
import {dirname, join} from "node:path";
import {readFileSync} from "node:fs";
import {VitePWA} from "vite-plugin-pwa";

/**
 * Where the app is served from. "/" locally; GitHub Pages serves under the repo name, which the
 * deploy workflow passes in. `start_url` and `scope` below must follow it or the installed PWA
 * opens the wrong URL.
 */
const base = process.env["BASE_PATH"] ?? "/";

/**
 * The bot's engine is Fairy-Stockfish built with threads, and a page may only share memory with its
 * threads once it is cross-origin isolated — which takes these two headers. The dev and preview
 * servers send them here; GitHub Pages cannot send headers at all, so in production the service
 * worker in `src/sw/` adds them to every response it serves. `docs/bot.md` has the reasoning.
 */
const CROSS_ORIGIN_ISOLATION = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

export default defineConfig({
  base,
  server: {
    port: 3000,
    strictPort: true,
    headers: CROSS_ORIGIN_ISOLATION,
  },
  preview: {
    port: 3000,
    strictPort: true,
    headers: CROSS_ORIGIN_ISOLATION,
  },
  build: {
    outDir: "build",
    rolldownOptions: {
      input: {
        game: join(import.meta.dirname, "index.html"),
        references: join(import.meta.dirname, "references.html"),
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    fairyStockfish(),
    VitePWA({
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

/**
 * Serves Fairy-Stockfish's files at `engine/` beside the app — straight out of `node_modules` in
 * development, and copied into the build for production — so the GPL binary is shipped exactly as
 * published, never committed, and never bundled into the app's own code. Its licence travels with it.
 *
 * Written inline rather than as a copy plugin, which would be another dependency for five files.
 */
function fairyStockfish(): Plugin {
  const directory = dirname(createRequire(import.meta.url).resolve("fairy-stockfish-nnue.wasm/stockfish.js"));

  return {
    name: "fairy-stockfish",

    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const file = ENGINE_FILES.find(name => request.url?.split("?")[0]?.endsWith(`/engine/${name}`));
        if (!file) return next();

        // Answered here, ahead of Vite, so `server.headers` never reaches these responses — and under
        // `require-corp` the engine's thread workers are refused unless their own script carries them.
        for (const [header, value] of Object.entries(CROSS_ORIGIN_ISOLATION)) response.setHeader(header, value);
        response.setHeader("Content-Type", contentTypeOf(file));
        response.end(readFileSync(join(directory, file)));
      });
    },

    generateBundle() {
      for (const file of ENGINE_FILES) {
        this.emitFile({type: "asset", fileName: `engine/${file}`, source: readFileSync(join(directory, file))});
      }
    },
  };
}

const ENGINE_FILES = ["stockfish.js", "stockfish.worker.js", "stockfish.wasm", "Copying.txt", "AUTHORS"];

function contentTypeOf(file: string): string {
  if (file.endsWith(".wasm")) return "application/wasm";
  if (file.endsWith(".js")) return "text/javascript";

  return "text/plain; charset=utf-8";
}
