import type {Account} from "@src/database/types/Account";
import {clearedSessionCookie} from "@src/router/http/routes/session-cookie/ClearedSessionCookie";
import {removeAccount} from "@src/database/accounts/RemoveAccount";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";

/**
 * `DELETE /api/account` — deletes everything kept for the player: the account, every session it has and its data. The
 * browser's cookie goes with it. What the player holds on their own devices is not this API's to touch.
 */
export async function deleteAccount(account: Account): Promise<Response> {
  await removeAccount(account.id);

  const response = respondEmpty(204);
  response.headers.append("Set-Cookie", clearedSessionCookie());

  return response;
}
