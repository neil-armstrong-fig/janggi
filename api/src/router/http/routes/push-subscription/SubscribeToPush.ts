import {dataWriteAllowed} from "@src/router/http/routes/rate-limit/DataWriteAllowed";
import {pushSubscriptionIn} from "@src/router/http/routes/push-subscription/subscription/PushSubscriptionIn";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {savePushSubscription} from "@src/database/push/SavePushSubscription";
import type {Account} from "@src/database/types/Account";

/**
 * `PUT /api/push-subscription` — the device asks to be told when it is the player's turn. What it sends is the browser's own
 * subscription, which the API trusts no further than any other body: a bad one is a 400. Sent again, it replaces what the device
 * had, which is how a changed key or a changed account is kept right.
 */
export async function subscribeToPush(request: Request, account: Account): Promise<Response> {
  if (!(await dataWriteAllowed(account.id))) return respondEmpty(429);

  const subscription = pushSubscriptionIn(await request.json().catch(() => undefined));
  if (subscription === undefined) return respondEmpty(400);

  await savePushSubscription({userId: account.id, subscription, now: new Date()});

  return respondEmpty(204);
}
