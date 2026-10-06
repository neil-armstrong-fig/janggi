import type {TurnNotificationsState} from "@janggi/shared/janggi/online/TurnNotificationsState";
import {notificationsSupported} from "@src/redux/notifications/utils/NotificationsSupported";
import {serviceWorkerRegistrationNow} from "@src/redux/notifications/utils/ServiceWorkerRegistrationNow";

/** Where this device stands on being told when it is the player's turn: not possible here, blocked by the browser, off, or on. */
export async function turnNotificationsStateNow(): Promise<TurnNotificationsState> {
  if (!notificationsSupported()) return "unavailable";
  if (Notification.permission === "denied") return "blocked";

  const registration = await serviceWorkerRegistrationNow();
  if (registration === undefined) return "unavailable";

  const subscription = (await registration.pushManager.getSubscription()) ?? undefined;
  if (subscription === undefined || Notification.permission !== "granted") return "off";

  return "on";
}
