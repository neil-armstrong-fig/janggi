/**
 * Whether this build carries the work not yet in production: the development server always does, and a build only
 * when compiled with `VITE_UNRELEASED=true`. Settled at build time, so the bundler removes what it guards and no
 * visitor can switch it on. `scripts/check-unreleased.mjs` proves the removal. See `webapp/AGENTS.md`.
 */
export const IN_DEVELOPMENT: boolean = import.meta.env.DEV || import.meta.env.VITE_UNRELEASED === "true";
