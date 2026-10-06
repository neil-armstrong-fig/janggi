import {clearedSessionCookie} from "@src/router/http/routes/session-cookie/ClearedSessionCookie";
import {deleteSession} from "@src/database/sessions/DeleteSession";
import {hashSessionToken} from "@src/router/shared/session/HashSessionToken";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {sessionTokenFrom} from "@src/router/shared/session/SessionTokenFrom";

/**
 * `POST /api/auth/logout` — ends the session the request carries, and the cookie with it. Succeeds for a request that
 * carries none: somebody already signed out has nothing left to end, and telling them so would only be an error to show.
 */
export async function logOut(request: Request): Promise<Response> {
  const token = sessionTokenFrom(request.headers.get("Cookie") ?? undefined);
  if (token !== undefined) await deleteSession(await hashSessionToken(token));

  const response = respondEmpty(204);
  response.headers.append("Set-Cookie", clearedSessionCookie());

  return response;
}
