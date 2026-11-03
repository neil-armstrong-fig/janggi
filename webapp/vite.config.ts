import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {join} from "node:path";
import {defineConfig} from "vite";
import {buildIdDefine} from "./vite/build-id/BuildIdDefine.js";
import {CROSS_ORIGIN_ISOLATION} from "./vite/engine/CrossOriginIsolation.js";
import {fairyStockfish} from "./vite/engine/FairyStockfish.js";
import {installableApp} from "./vite/installable-app/InstallableApp.js";
import {prerenderedPages} from "./vite/prerendered-pages/PrerenderedPages.js";
import {datedSitemapFile} from "./vite/sitemap/DatedSitemapFile.js";

/**
 * Where the app is served from. "/" locally; GitHub Pages serves under the repo name, which the
 * deploy workflow passes in. `start_url` and `scope` in `vite/installable-app/` follow it.
 */
const base = process.env["BASE_PATH"] ?? "/";

/**
 * The configuration, and nothing more: each plugin the build needs is its own subject under `vite/`, named
 * for what it does.
 */
export default defineConfig({
  base,
  define: buildIdDefine(),
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
        koreanGame: join(import.meta.dirname, "ko", "index.html"),
        guide: join(import.meta.dirname, "learn.html"),
        privacy: join(import.meta.dirname, "privacy.html"),
        references: join(import.meta.dirname, "references.html"),
        terms: join(import.meta.dirname, "terms.html"),
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react(), tailwindcss(), prerenderedPages(), datedSitemapFile(), fairyStockfish(), installableApp(base)],
});
