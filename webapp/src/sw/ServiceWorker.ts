import {addPlugins, cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import type {PrecacheEntry} from "workbox-precaching";
import type {AppWindows} from "@src/sw/notifying/types/AppWindows";
import {keptLanguage} from "@src/sw/notifying/KeptLanguage";
import {showTheApp} from "@src/sw/notifying/ShowTheApp";
import type {TurnNotification} from "@src/sw/notifying/types/TurnNotification";
import {serverOrigin} from "@src/redux/account/server/ServerOrigin";
import {setDefaultHandler} from "workbox-routing";
import {turnNotificationOf} from "@src/sw/notifying/TurnNotificationOf";

/** An activate event, which can hold the worker in that phase until a promise settles. */
interface LifecycleEvent extends Event {
  readonly waitUntil: (promise: Promise<unknown>) => void;
}

/** A message sent from a page to the worker waiting behind the active release. */
interface WorkerMessageEvent extends Event {
  readonly data: unknown;
}

/** The one page message this worker understands. */
interface SkipWaitingMessage {
  readonly type: "SKIP_WAITING";
}

/** A request a page has made, which the worker may answer or leave to the network. */
interface FetchRequestEvent extends Event {
  readonly request: Request;
  readonly stopImmediatePropagation: () => void;
}

/** A push the server sent: what it carried, if anything. */
interface PushMessageEvent extends LifecycleEvent {
  readonly data: {readonly text: () => string} | null;
}

/** A tap on a notification this worker showed. */
interface NotificationTapEvent extends LifecycleEvent {
  readonly notification: {readonly close: () => void};
}

/** The pages this worker serves. */
interface WorkerClients extends AppWindows {
  readonly claim: () => Promise<void>;
}

/** What shows notifications for this worker's pages, and where the app is served from. */
interface WorkerRegistration {
  readonly scope: string;
  readonly showNotification: (title: string, options: TurnNotification["options"]) => Promise<void>;
}

/**
 * The part of the worker's own global this file touches, and the precache list vite-plugin-pwa writes
 * into it at build time. Declared here rather than taken from the `WebWorker` lib, which cannot sit in
 * the same program as the `DOM` lib the rest of the app compiles against.
 */
interface WorkerScope {
  readonly __WB_MANIFEST: (string | PrecacheEntry)[];
  readonly clients: WorkerClients;
  readonly registration: WorkerRegistration;
  readonly caches: Parameters<typeof keptLanguage>[0];
  readonly skipWaiting: () => Promise<void>;
  readonly addEventListener: {
    (type: "activate", listener: (event: LifecycleEvent) => void): void;
    (type: "message", listener: (event: WorkerMessageEvent) => void): void;
    (type: "fetch", listener: (event: FetchRequestEvent) => void): void;
    (type: "push", listener: (event: PushMessageEvent) => void): void;
    (type: "notificationclick", listener: (event: NotificationTapEvent) => void): void;
  };
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
 * A later worker waits until the page's release notice asks it to take over, keeping one coherent
 * release in use until the player is ready. `docs/bot.md` has the isolation reasoning.
 *
 * **It never touches a call to the sign-in and sync API.** Those are cross-origin requests that answer under CORS and
 * need none of the isolation headers, so the worker has no business in them — and one that handled them would put a
 * worker between the app and its server, making sync depend on it and hiding the calls from the acceptance tests'
 * stand-in for the API, which can only see what the browser sends itself.
 *
 * It also shows the "it's your turn" notification the API pushes when a friend has moved and the player is away, and brings the
 * app to the front when it is tapped (`docs/online-play.md`). Every push is shown: a browser takes back the subscription of a worker
 * that receives pushes and shows nothing, so deciding whom to tell is the server's, never this worker's.
 */
// First, and before anything of Workbox's is registered: a listener that stops the event reaching the others and does not
// answer it leaves the request to the browser, which is the only way to decline one the default handler would take.
self.addEventListener("fetch", event => {
  if (new URL(event.request.url).origin === serverOrigin()) event.stopImmediatePropagation();
});

self.addEventListener("message", event => {
  if (isSkipWaitingMessage(event.data)) void self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  event.waitUntil(showTurnNotification(event.data?.text()));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(showTheApp(self.clients, self.registration.scope));
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

/** Shows what a push says, in the language the page last said the game is read in. Always shows something. */
async function showTurnNotification(pushed: string | undefined): Promise<void> {
  const language = await keptLanguage(self.caches, self.registration.scope);
  const notification = turnNotificationOf(pushed, language);

  await self.registration.showNotification(notification.title, notification.options);
}

function isSkipWaitingMessage(message: unknown): message is SkipWaitingMessage {
  return typeof message === "object" && message !== null && "type" in message && message.type === "SKIP_WAITING";
}
