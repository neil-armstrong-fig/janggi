/**
 * The bot's engine is Fairy-Stockfish built with threads, and a page may only share memory with its
 * threads once it is cross-origin isolated — which takes these two headers. The dev and preview
 * servers send them here; GitHub Pages cannot send headers at all, so in production the service
 * worker in `src/sw/` adds them to every response it serves. `docs/bot.md` has the reasoning.
 */
export const CROSS_ORIGIN_ISOLATION = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};
