import type {Account} from "@src/database/types/Account";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {signedInAccount} from "@src/router/shared/session/SignedInAccount";

/**
 * Runs a route that is a signed-in player's own. The session is looked for **here, once**, so no route can forget to ask: with none
 * that is still good the answer is 401 and the route is never called, and with one the route is handed the account.
 */
export async function forSignedInPlayer(
  request: Request,
  answer: (account: Account) => Promise<Response>,
): Promise<Response> {
  const account = await signedInAccount(request);
  if (account === undefined) return respondEmpty(401);

  return answer(account);
}
