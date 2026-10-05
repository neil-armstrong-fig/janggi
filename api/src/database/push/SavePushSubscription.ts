import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";
import type {SubscriptionToSave} from "@src/database/types/SubscriptionToSave";

/**
 * Keeps a device's subscription for the account. A device that is already known has its keys and its account replaced: someone
 * who signs in as another player on the same browser takes the notifications with them, and the first player stops getting them.
 */
export async function savePushSubscription({userId, subscription, now}: SubscriptionToSave): Promise<void> {
  const {endpoint, p256dh, auth} = subscription;

  await database
    .insert(pushSubscriptions)
    .values({endpoint, userId, p256dh, auth, createdAt: now})
    .onConflictDoUpdate({target: pushSubscriptions.endpoint, set: {userId, p256dh, auth, createdAt: now}});
}
