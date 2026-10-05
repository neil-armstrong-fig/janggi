import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import type {PushSubscription} from "@src/database/types/PushSubscription";
import {pushSubscriptions} from "@src/database/schema/PushSubscriptions";

/** Every device the account asked to be told on. */
export async function pushSubscriptionsOf(userId: string): Promise<readonly PushSubscription[]> {
  return database
    .select({
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
    })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));
}
