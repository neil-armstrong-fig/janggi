import {createRequire} from "node:module";
import {dirname, join} from "node:path";
import {readFileSync} from "node:fs";
import type {Plugin} from "vite";
import {CROSS_ORIGIN_ISOLATION} from "./CrossOriginIsolation.js";

/**
 * Serves Fairy-Stockfish's files at `engine/` beside the app — straight out of `node_modules` in
 * development, and copied into the build for production — so the GPL binary is shipped exactly as
 * published, never committed, and never bundled into the app's own code. Its licence travels with it.
 *
 * Written inline rather than as a copy plugin, which would be another dependency for five files.
 */
export function fairyStockfish(): Plugin {
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
