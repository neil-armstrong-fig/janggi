/**
 * Whether this browser can be sent a notification by a server: it has notifications, push and a service worker. An iPhone has none
 * of them until the app is on its Home Screen, which is how it is told apart from one that does.
 */
export function notificationsSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in globalThis && "Notification" in globalThis;
}
