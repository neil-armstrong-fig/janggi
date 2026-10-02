import type {RouteServices} from "@src/handler/services/RouteServices";
import {randomToken} from "@src/handler/random/RandomToken";
import {oauthCookie} from "@src/handler/oauth/OAuthCookie";
import {clientOf} from "@src/handler/routes/ClientOf";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";
import {respondRedirect} from "@src/handler/respond/RespondRedirect";
import {returnAddress} from "@src/handler/oauth/ReturnAddress";

/**
 * `GET /api/auth/google` — sends the player to Google, holding this attempt in a short-lived cookie so the callback can
 * tell it from one somebody else started. Where the app asked to be brought back to is kept with it, once checked.
 */
export async function startSignIn(request: Request, services: RouteServices): Promise<Response> {
  if (!(await services.loginLimiter.allow(clientOf(request)))) return respondEmpty(429);

  const state = randomToken();
  const codeVerifier = randomToken();
  const returnTo = returnAddress(new URL(request.url).searchParams.get("return"), services.allowedOrigins);

  return respondRedirect((await services.google.authorizationUrl(state, codeVerifier)).href, [
    oauthCookie({state, codeVerifier, returnTo}),
  ]);
}
