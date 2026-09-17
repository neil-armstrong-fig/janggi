import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {createRequire} from "node:module";
import {createElement, StrictMode} from "react";
import type {ComponentType} from "react";
import {createServer, defineConfig} from "vite";
import type {Plugin} from "vite";
import {dirname, join} from "node:path";
import {readFileSync} from "node:fs";
import {renderToString} from "react-dom/server";
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
        guide: join(import.meta.dirname, "learn.html"),
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
    learnGuide(),
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
      includeAssets: ["icon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "maskable-icon-512.png"],
      manifest: {
        id: base,
        name: "Janggi",
        short_name: "Janggi",
        description: "Play Janggi (Korean chess) free against a friend or AI, online or offline.",
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
    }),
  ],
});

/** The guide stays crawlable without maintaining a second, non-React copy of its content. */
function learnGuide(): Plugin {
  return {
    name: "learn-guide",
    transformIndexHtml: {
      order: "pre",
      async handler(html, context) {
        if (!context.filename.endsWith("learn.html")) return;

        const markup = context.server
          ? markupFor((await context.server.ssrLoadModule(LEARN_PAGE_MODULE)) as LearnPageModule)
          : await renderLearnGuide();

        return html.replace(GUIDE_MARKER, markup);
      },
    },
  };
}

const GUIDE_MARKER = "<!--guide-content-->";
const LEARN_PAGE_MODULE = "/src/react/pages/learn/LearnPage.tsx";

interface LearnPageModule {
  readonly LearnPage: ComponentType;
}

async function renderLearnGuide(): Promise<string> {
  const renderingServer = await createServer({
    appType: "custom",
    configFile: false,
    root: import.meta.dirname,
    server: {hmr: false, middlewareMode: true, ws: false},
    resolve: {tsconfigPaths: true},
    plugins: [react()],
  });

  try {
    const learnPageModule = (await renderingServer.ssrLoadModule(LEARN_PAGE_MODULE)) as LearnPageModule;

    return markupFor(learnPageModule);
  } finally {
    await renderingServer.close();
  }
}

function markupFor(learnPageModule: LearnPageModule): string {
  return renderToString(createElement(StrictMode, undefined, createElement(learnPageModule.LearnPage)));
}

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
