/**
 * Checks a registered worker while the app is in use, and returns the cleanup for those checks.
 * Registration itself checks on launch; these checks cover a tab or installed PWA left open across
 * a deployment.
 */
export function watchForRelease(registration: ServiceWorkerRegistration): () => void {
  const interval = window.setInterval(check, RELEASE_CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", check);
  window.addEventListener("online", check);

  return () => {
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", check);
    window.removeEventListener("online", check);
  };

  function check(): void {
    if (document.visibilityState !== "visible" || !navigator.onLine) return;
    if (registration.installing || registration.waiting) return;

    void registration.update().catch(() => undefined);
  }
}

const RELEASE_CHECK_INTERVAL_MS = 60 * 60 * 1000;
