import {encryptPushBody} from "@src/push/encrypting/EncryptPushBody";
import {pushSubscriptionsOf} from "@src/database/push/PushSubscriptionsOf";
import {removePushSubscription} from "@src/database/push/RemovePushSubscription";
import {sendPush} from "@src/push/SendPush";
import {vapidAuthorization} from "@src/push/vapid/VapidAuthorization";
import {VAPID_PUBLIC_KEY} from "@janggi/shared/janggi/online/VapidPublicKey";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {PushSubscription} from "@src/database/types/PushSubscription";
import type {TurnNotification} from "@src/room/notifying/types/TurnNotification";

/**
 * Tells every device the player subscribed that it is their turn, naming who played. The message is `{opponent}` and nothing
 * more: the page the notification opens knows the rest. A device that has gone for good is forgotten. Does nothing where the
 * Worker has no VAPID private key, and swallows whatever else goes wrong: it runs beside the game, never in front of it.
 */
export async function notifyTurn({accountId, opponentName}: TurnNotification): Promise<void> {
  const {VAPID_PRIVATE_KEY, VAPID_SUBJECT} = workerEnvironment;
  if (!VAPID_PRIVATE_KEY || !VAPID_SUBJECT) return;

  try {
    const message = JSON.stringify({opponent: opponentName});
    const devices = await pushSubscriptionsOf(accountId);
    const keys = {publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY, subject: VAPID_SUBJECT};

    await Promise.all(devices.map(device => tellDevice(device, message, keys, accountId)));
  } catch {
    // The room has already done what it was asked; a notification that cannot be sent is not worth failing it for.
  }
}

async function tellDevice(
  device: PushSubscription,
  message: string,
  keys: {readonly publicKey: string; readonly privateKey: string; readonly subject: string},
  accountId: string,
): Promise<void> {
  const body = await encryptPushBody(message, device);
  if (body === undefined) return;

  const authorization = await vapidAuthorization({endpoint: device.endpoint, ...keys, now: new Date()});
  const outcome = await sendPush({endpoint: device.endpoint, authorization, body});

  if (outcome === "gone") await removePushSubscription({userId: accountId, endpoint: device.endpoint});
}
