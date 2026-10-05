import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {WORKER_LANGUAGE_CACHE, WORKER_LANGUAGE_PATH} from "@src/language/notification/WorkerLanguageAddress";

/** What the worker can ask of the browser's caches. */
interface KeptCaches {
  readonly open: (
    name: string,
  ) => Promise<{readonly match: (request: URL) => Promise<{readonly text: () => Promise<string>} | undefined>}>;
}

/** The language the page last said it is read in (`keepLanguageForWorker`), or English where it has not said or the caches fail. */
export async function keptLanguage(caches: KeptCaches, scope: string): Promise<LanguageName> {
  try {
    const cache = await caches.open(WORKER_LANGUAGE_CACHE);
    const kept = await (await cache.match(new URL(WORKER_LANGUAGE_PATH, scope)))?.text();

    return LANGUAGE_NAMES.find(known => known === kept) ?? "en";
  } catch {
    return "en";
  }
}
