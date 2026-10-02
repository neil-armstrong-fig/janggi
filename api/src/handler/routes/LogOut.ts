import type {RouteServices} from "@src/handler/services/RouteServices";
import {clearedSessionCookie} from "@src/handler/session/ClearedSessionCookie";
import {hashSessionToken} from "@src/handler/session/HashSessionToken";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";
import {sessionTokenFrom} from "@src/handler/session/SessionTokenFrom";

/**
 * `POST /api/auth/logout` — ends the session the request carries, and the cookie with it. Succeeds for a request that
 * carries none: somebody already signed out has nothing left to end, and telling them so would only be an error to show.
 */
export async function logOut(request: Request, services: RouteServices): Promise<Response> {
  const token = sessionTokenFrom(request.headers.get("Cookie"));
  if (token !== undefined) await services.store.deleteSession(await hashSessionToken(token));

  const response = respondEmpty(204);
  response.headers.append("Set-Cookie", clearedSessionCookie());

  return response;
}
