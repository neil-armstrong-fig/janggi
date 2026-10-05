/**
 * Where the page leaves the language it is read in, for the service worker, which cannot read the store or `localStorage`: a
 * response in this cache, at this path under the app's own address (`BASE_URL` for the page, the registration's scope for the worker,
 * which are the same place).
 */
export const WORKER_LANGUAGE_CACHE = "janggi-worker-language";

export const WORKER_LANGUAGE_PATH = "worker-language";
