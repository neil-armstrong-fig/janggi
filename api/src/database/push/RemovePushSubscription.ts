import {and, eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";
import type {SubscriptionToRemove} from "@src/database/types/SubscriptionToRemove";

/** The account no longer wants that device told; a device it does not have, or that is another account's, is nothing to do. */
export async function removePushSubscription({userId, endpoint}: SubscriptionToRemove): Promise<void> {
  await database
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.userId, userId)));
}
