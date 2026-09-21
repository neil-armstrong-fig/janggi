/**
 * The `sessionStorage` key that records that this browser session has already **spent its one reload**
 * on becoming cross-origin isolated. Its value is `"true"` once spent, and it is absent until then.
 *
 * The bot's engine needs an isolated page, and GitHub Pages cannot send the headers for one, so the
 * service worker adds them (`docs/bot.md` §4). A first visit is served before that worker exists and so
 * is not isolated; when the worker takes control, `main.tsx` reloads the page once so it comes back
 * through it. That is the reload this key counts. It is written just before the reload, and read by
 * `main.tsx` (to reload only once) and by `reloadMayStillCome` (to know whether one is still on its way).
 *
 * **Why it is written down at all:** a browser that will not isolate the page even under the worker
 * would otherwise be sent round that reload for ever. A page that finds it already spent knows none is
 * coming — it is isolated by now, or never going to be — which is what lets the bot say it is unavailable
 * instead of waiting for a reload that will not happen.
 *
 * **Why `sessionStorage`:** it lasts as long as the tab and goes with it, so a visit tomorrow gets its
 * reload again. It also survives a hard refresh, which bypasses the service worker: that is how a saved
 * bot game comes to sit on a page with the reload spent and no isolation.
 *
 * The string is what already sits in players' open sessions, so it keeps its old spelling; the name
 * here says what it means.
 */
export const ISOLATION_RELOAD_SPENT_KEY = "janggi.reloadedForIsolation";
