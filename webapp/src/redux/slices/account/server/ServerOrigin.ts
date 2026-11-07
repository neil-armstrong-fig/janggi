import {API_ORIGIN} from "@janggi/shared/janggi/account/ApiOrigin";

/**
 * The origin of the sign-in and sync API: `API_ORIGIN` unless a build is pointed elsewhere (`VITE_API_ORIGIN`).
 *
 * Read where it is used rather than held in a constant, and shared with the service worker, which has to know
 * which requests to leave alone.
 */
export function serverOrigin(): string {
  return import.meta.env.VITE_API_ORIGIN ?? API_ORIGIN;
}
