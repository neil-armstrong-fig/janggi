import type {AppStore} from "@src/redux/Store";
import {debugSaveIn} from "@src/redux/debug/DebugSaveIn";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";

/**
 * Lets a message posted to the page set the player's progress:
 * `window.postMessage({janggi: "debug", progress: {xp: 640, beaten: {cho: [800]}}})`.
 *
 * **It gives nobody anything they could not already have.** A save key is plain, unsigned and pasteable
 * by design (`SaveKeyJson`) — this only saves opening the sheet and typing one in, which is exactly what
 * makes it worth having in a test: an acceptance test can put a player anywhere on the ladder in a
 * single call, and drive the app from there. That is also why it is not compiled out of a production
 * build: a spec then behaves the same against the dev server, a preview build and the deployed site,
 * which is what CI runs it against.
 *
 * **Only this window is listened to.** A page that embedded the app in a frame could post to it
 * otherwise — it would gain nothing, the XP being this device's alone, but there is no reason to answer.
 */
export function listenForDebugMessages(store: AppStore, target: Window): void {
  target.addEventListener("message", event => {
    if (event.source !== target) return;

    const save = debugSaveIn(event.data);
    if (save) store.dispatch(saveLoaded(save));
  });
}
