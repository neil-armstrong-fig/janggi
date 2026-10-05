import {VAPID_PUBLIC_KEY} from "@janggi/shared/janggi/online/VapidPublicKey";
import type {TurnNotificationsState} from "@janggi/shared/janggi/online/TurnNotificationsState";
import {callServer} from "@src/redux/account/server/CallServer";
import {keyBytes} from "@src/redux/notifications/utils/KeyBytes";
import {serviceWorkerRegistrationNow} from "@src/redux/notifications/utils/ServiceWorkerRegistrationNow";
import {turnNotificationsStateNow} from "@src/redux/notifications/TurnNotificationsStateNow";

/**
 * Asks the browser's leave to notify, subscribes this device to the push service with the app's key, and gives the server the
 * address to send to. Called from a tap, because a browser (an iPhone's above all) will not ask from anywhere else. Where any step
 * fails the device is left as it was found — a subscription the server never heard of would be a notification it can never send —
 * and the state says how it stands now.
 */
export async function turnOnTurnNotifications(): Promise<TurnNotificationsState> {
  try {
    if ((await Notification.requestPermission()) !== "granted") return await turnNotificationsStateNow();

    const registration = await serviceWorkerRegistrationNow();
    if (registration === undefined) return await turnNotificationsStateNow();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyBytes(VAPID_PUBLIC_KEY),
    });

    const response = await callServer("/api/push-subscription", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!response.ok) await subscription.unsubscribe();
  } catch {
    // Offline, or a push service that would not have us: the state below says it is off.
  }

  return turnNotificationsStateNow();
}
