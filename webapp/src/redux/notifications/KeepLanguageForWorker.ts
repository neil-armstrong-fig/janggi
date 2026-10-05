import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {WORKER_LANGUAGE_CACHE, WORKER_LANGUAGE_PATH} from "@src/language/notification/WorkerLanguageAddress";

/**
 * Leaves the language the player reads the game in where the service worker can find it, so a notification it shows is in that
 * language. Best effort: a browser with no cache storage leaves the worker to English.
 */
export async function keepLanguageForWorker(language: LanguageName): Promise<void> {
  try {
    const cache = await caches.open(WORKER_LANGUAGE_CACHE);

    await cache.put(
      new URL(`${import.meta.env.BASE_URL}${WORKER_LANGUAGE_PATH}`, globalThis.location.origin),
      new Response(language),
    );
  } catch {
    // Nowhere to keep it: the notification is English.
  }
}
