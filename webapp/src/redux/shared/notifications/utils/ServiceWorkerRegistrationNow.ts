/**
 * The registration of this app's service worker, or undefined where it has none (the development server runs without one).
 * Asked for rather than waited for: a page with no worker would wait for ever.
 */
export async function serviceWorkerRegistrationNow(): Promise<ServiceWorkerRegistration | undefined> {
  return navigator.serviceWorker.getRegistration();
}
