/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /**
   * Debug: the progress the app opens at, over whatever is stored — a bare amount of XP, or a whole
   * progress as JSON. `Store.ts` reads it; `ProgressFromDebug.ts` says what it takes.
   */
  readonly VITE_DEBUG_XP?: string;
}
