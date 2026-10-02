import type {Account} from "@src/database/types/Account";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {clearedSessionCookie} from "@src/handler/session/ClearedSessionCookie";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";

/**
 * `DELETE /api/account` — deletes everything kept for the player: the account, every session it has and its data. The
 * browser's cookie goes with it. What the player holds on their own devices is not this API's to touch.
 */
export async function deleteAccount(account: Account, services: RouteServices): Promise<Response> {
  await services.store.deleteAccount(account.id);

  const response = respondEmpty(204);
  response.headers.append("Set-Cookie", clearedSessionCookie());

  return response;
}
