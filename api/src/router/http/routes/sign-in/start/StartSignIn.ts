import {allowedOrigins} from "@src/router/shared/origin/AllowedOrigins";
import {googleAuthorizationUrl} from "@src/router/http/routes/sign-in/google/GoogleAuthorizationUrl";
import {googleRedirectUri} from "@src/router/http/routes/sign-in/google/GoogleRedirectUri";
import {loginAllowed} from "@src/router/http/routes/rate-limit/LoginAllowed";
import {randomToken} from "@src/router/http/routes/sign-in/RandomToken";
import {oauthCookie} from "@src/router/http/routes/sign-in/start/oauth-cookie/OAuthCookie";
import {clientOf} from "@src/router/http/routes/sign-in/ClientOf";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {respondRedirect} from "@src/router/http/routes/sign-in/RespondRedirect";
import {returnAddress} from "@src/router/http/routes/sign-in/start/return-address/ReturnAddress";

/**
 * `GET /api/auth/google` — sends the player to Google, holding this attempt in a short-lived cookie so the callback can
 * tell it from one somebody else started. Where the app asked to be brought back to is kept with it, once checked.
 */
export async function startSignIn(request: Request): Promise<Response> {
  if (!(await loginAllowed(clientOf(request)))) return respondEmpty(429);

  const state = randomToken();
  const codeVerifier = randomToken();
  const asked = new URL(request.url).searchParams.get("return") ?? undefined;
  const returnTo = returnAddress(asked, allowedOrigins());

  return respondRedirect(
    (await googleAuthorizationUrl({state, codeVerifier, redirectUri: googleRedirectUri(request)})).href,
    [oauthCookie({state, codeVerifier, returnTo})],
  );
}
