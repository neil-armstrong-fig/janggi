/**
 * How long a first visit may take to come back cross-origin isolated. The service worker precaches the engine's wasm
 * before it takes control, which is seconds on a slow runner — past the config's action timeout.
 */
export const ISOLATION_TIMEOUT_MS = 15_000;
