import type {Account} from "@src/database/types/Account";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {hashSessionToken} from "@src/handler/session/HashSessionToken";
import {sessionTokenFrom} from "@src/handler/session/SessionTokenFrom";

/** The account a request's session cookie belongs to, or undefined where it has none, or none that is still good. */
export async function signedInAccount(request: Request, services: RouteServices): Promise<Account | undefined> {
  const token = sessionTokenFrom(request.headers.get("Cookie"));
  if (token === undefined) return undefined;

  return services.store.accountOfSession(await hashSessionToken(token), services.now());
}
