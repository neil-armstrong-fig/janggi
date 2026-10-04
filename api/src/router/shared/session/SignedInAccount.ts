import type {Account} from "@src/database/types/Account";
import {accountOfSession} from "@src/database/sessions/AccountOfSession";
import {hashSessionToken} from "@src/router/shared/session/HashSessionToken";
import {sessionTokenFrom} from "@src/router/shared/session/SessionTokenFrom";

/** The account a request's session cookie belongs to, or undefined where it has none, or none that is still good. */
export async function signedInAccount(request: Request): Promise<Account | undefined> {
  const token = sessionTokenFrom(request.headers.get("Cookie"));
  if (token === undefined) return undefined;

  return accountOfSession(await hashSessionToken(token), new Date());
}
