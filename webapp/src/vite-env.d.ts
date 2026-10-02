/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /**
   * Debug: the progress the app opens at, over whatever is stored — a bare amount of XP, or a whole
   * progress as JSON. `Store.ts` reads it; `ProgressFromDebug.ts` says what it takes.
   */
  readonly VITE_DEBUG_XP?: string;
  /** Where the sign-in and sync API is, where it is not at `API_ORIGIN` — a local `wrangler dev`, say. */
  readonly VITE_API_ORIGIN?: string;
}
