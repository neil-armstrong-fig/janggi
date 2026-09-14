import "@src/index.css";
import {App} from "@src/react/App";
import {store} from "@src/redux/Store";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in index.html");

reloadOnceIsolatedByTheServiceWorker();

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

const RELOADED_FOR_ISOLATION = "janggi.reloadedForIsolation";
