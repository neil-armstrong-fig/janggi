import {ISOLATION_RELOAD_SPENT_KEY} from "@src/isolation/IsolationReloadSpentKey";

/**
 * Whether a page that is not cross-origin isolated may still be reloaded into being so — the service
 * worker not having taken control yet, on a first visit, and this session not yet having been sent round
 * that reload once (`main.tsx`).
 *
 * The engine asks it before deciding it has no future here: a bot game restored on load calls for the
 * engine inside exactly that window, and calling it unavailable a moment before the reload would be wrong.
 * Once this is false and the page is still not isolated, nothing is going to change that.
 */
export function reloadMayStillCome(): boolean {
  if (globalThis.crossOriginIsolated || !("serviceWorker" in navigator)) return false;

  try {
    return sessionStorage.getItem(ISOLATION_RELOAD_SPENT_KEY) === null;
  } catch {
    return false;
  }
}
