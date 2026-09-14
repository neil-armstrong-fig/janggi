import {addPlugins, cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import type {PrecacheEntry} from "workbox-precaching";
import {setDefaultHandler} from "workbox-routing";

/** An install or activate event, which can hold the worker in that phase until a promise settles. */
interface LifecycleEvent extends Event {
  readonly waitUntil: (promise: Promise<unknown>) => void;
}

/** The pages this worker serves. */
interface WorkerClients {
  readonly claim: () => Promise<void>;
}

/**
 * The part of the worker's own global this file touches, and the precache list vite-plugin-pwa writes
 * into it at build time. Declared here rather than taken from the `WebWorker` lib, which cannot sit in
 * the same program as the `DOM` lib the rest of the app compiles against.
 */
interface WorkerScope {
  readonly __WB_MANIFEST: (string | PrecacheEntry)[];
  readonly clients: WorkerClients;
  readonly skipWaiting: () => Promise<void>;
  readonly addEventListener: (type: "install" | "activate", listener: (event: LifecycleEvent) => void) => void;
}

declare const self: WorkerScope;

/**
 * The app's service worker: it keeps the app working offline, as the generated one did, and it makes
 * the page **cross-origin isolated** on a host that cannot send headers.
 *
 * The bot's engine runs on threads that share memory with the page, and a browser allows that only
 * under `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`. GitHub Pages sends neither,
 * so every response this worker hands the page — from the precache or the network — has them added.
 * The very first visit is served before the worker exists; `main.tsx` reloads once it takes control.
 * `docs/bot.md` has the reasoning.
 */
self.addEventListener("install", () => {
  void self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

addPlugins([{handlerWillRespond: ({response}) => Promise.resolve(isolated(response))}]);
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

setDefaultHandler(async ({request}) => isolated(await fetch(request)));

/**
 * A response with the isolation headers added. An opaque response — a cross-origin request made
 * without CORS — cannot be read or rebuilt, so it goes through as it came.
 */
function isolated(response: Response): Response {
  if (response.type === "opaque" || response.status === 0) return response;

  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");

  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}
