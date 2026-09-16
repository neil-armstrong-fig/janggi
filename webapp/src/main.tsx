import "@src/index.css";
import {App} from "@src/react/App";
import {PROGRESS_STORAGE_KEY} from "@src/redux/progress/storage/ProgressStorageKey";
import {listenForDebugMessages} from "@src/redux/debug/ListenForDebugMessages";
import {store} from "@src/redux/Store";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in index.html");

reloadOnceIsolatedByTheServiceWorker();
hintAtTheHackerTheme();
listenForDebugMessages(store, window);

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

/**
 * The bot's engine needs the page cross-origin isolated, and on GitHub Pages only the service worker
 * can make it so (`src/sw/ServiceWorker.ts`). The first visit is served before that worker exists, so
 * when it takes control of a page that is not yet isolated, the page loads once more under it.
 *
 * Once per session and no more: a browser that will not isolate a page at all must not be sent round
 * a reload loop. The bot is simply unavailable there.
 */
function reloadOnceIsolatedByTheServiceWorker(): void {
  if (globalThis.crossOriginIsolated || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    try {
      if (sessionStorage.getItem(RELOADED_FOR_ISOLATION) !== null) return;

      sessionStorage.setItem(RELOADED_FOR_ISOLATION, "true");
      location.reload();
    } catch {
      // No session storage to remember the reload by, so no reload: better no bot than a loop.
    }
  });
}

/**
 * The Hacker theme costs a million XP, and the game would rather be hacked than ground out: whoever opens
 * the console to see how it works is told where to look. See `UNLOCK_PRICES`.
 *
 * Both routes are named, because both are plain and neither is worth hiding. A save key is base64url JSON
 * with no signature on it (`SaveKeyJson`) — anybody who wondered would have it decoded in a minute — and
 * what either route sets is a number on the player's own device. There is nothing here to protect, so the
 * only thing secrecy would buy is a worse joke.
 */
function hintAtTheHackerTheme(): void {
  // eslint-disable-next-line no-console -- the one message written for whoever opens the console, on purpose
  console.info(
    `%c> curious? your XP is in localStorage["${PROGRESS_STORAGE_KEY}"], and a save key is base64url JSON — decode it, change it, paste it back`,
    "color: #00ff66; background: #050805; font-family: monospace; padding: 2px 6px",
  );
}

const RELOADED_FOR_ISOLATION = "janggi.reloadedForIsolation";
