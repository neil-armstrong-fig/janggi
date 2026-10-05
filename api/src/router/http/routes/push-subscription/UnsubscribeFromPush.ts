import {isRecord} from "@src/json/IsRecord";
import {removePushSubscription} from "@src/database/push/RemovePushSubscription";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import type {Account} from "@src/database/types/Account";

/** `DELETE /api/push-subscription` — the device no longer wants to be told. One that was never subscribed is not an error. */
export async function unsubscribeFromPush(request: Request, account: Account): Promise<Response> {
  const body: unknown = await request.json().catch(() => undefined);
  if (!isRecord(body) || typeof body["endpoint"] !== "string") return respondEmpty(400);

  await removePushSubscription({userId: account.id, endpoint: body["endpoint"]});

  return respondEmpty(204);
}
