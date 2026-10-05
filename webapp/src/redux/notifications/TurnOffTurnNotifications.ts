import type {TurnNotificationsState} from "@janggi/shared/janggi/online/TurnNotificationsState";
import {callServer} from "@src/redux/account/server/CallServer";
import {notificationsSupported} from "@src/redux/notifications/utils/NotificationsSupported";
import {serviceWorkerRegistrationNow} from "@src/redux/notifications/utils/ServiceWorkerRegistrationNow";
import {turnNotificationsStateNow} from "@src/redux/notifications/TurnNotificationsStateNow";

/**
 * Tells the server to stop sending to this device, then drops the browser's subscription. The server is told first: a device that
 * has forgotten its address could not ask afterwards. If the server cannot be reached its row stays, and goes the first time the
 * push service says the address is dead. Does nothing, and never fails, where there is nothing to turn off.
 */
export async function turnOffTurnNotifications(): Promise<TurnNotificationsState> {
  if (notificationsSupported()) {
    try {
      const registration = await serviceWorkerRegistrationNow();
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await callServer("/api/push-subscription", {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({endpoint: subscription.endpoint}),
        }).catch(() => undefined);

        await subscription.unsubscribe();
      }
    } catch {
      // Whatever could not be undone here is undone by the server the next time it sends.
    }
  }

  return turnNotificationsStateNow();
}
