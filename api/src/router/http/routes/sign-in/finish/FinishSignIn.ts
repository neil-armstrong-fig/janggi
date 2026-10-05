import type {HttpRouteAnswer} from "@src/router/http/routes/types/HttpRouteAnswer";
import {createSession} from "@src/database/sessions/CreateSession";
import {errorNameOf} from "@src/observability/ErrorNameOf";
import {findOrCreateAccount} from "@src/database/accounts/FindOrCreateAccount";
import {googleRedirectUri} from "@src/router/http/routes/sign-in/google/GoogleRedirectUri";
import {googleSubjectOf} from "@src/router/http/routes/sign-in/google/GoogleSubjectOf";
import {loginAllowed} from "@src/router/http/routes/rate-limit/LoginAllowed";
import {SESSION_LIFETIME_SECONDS} from "@src/router/http/routes/sign-in/finish/session-cookie/SessionLifetime";
import {sessionCookie} from "@src/router/http/routes/sign-in/finish/session-cookie/SessionCookie";
import {clearedOauthCookie} from "@src/router/http/routes/sign-in/finish/oauth-cookie/ClearedOauthCookie";
import {oauthAttemptFrom} from "@src/router/http/routes/sign-in/finish/oauth-cookie/OAuthAttemptFrom";
import {clientOf} from "@src/router/http/routes/sign-in/ClientOf";
import {generatedDisplayName} from "@src/router/http/routes/sign-in/finish/generated-display-name/GeneratedDisplayName";
import {hashSessionToken} from "@src/router/shared/session/HashSessionToken";
import {randomToken} from "@src/router/http/routes/sign-in/RandomToken";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {respondRedirect} from "@src/router/http/routes/sign-in/RespondRedirect";
import {httpRouteAnswerFor} from "@src/router/http/routes/answer/HttpRouteAnswerFor";

/**
 * `GET /api/auth/google/callback` — Google sending the player back. The attempt must be one this API started (the state
 * in the cookie is the one that came back), and Google must say who the player is; then they are given a session, and
 * a new account if Google's id has none, called by one of the generals.
 *
 * Whatever goes wrong, the player is sent back to the app with no session rather than shown an error page here: the
 * app asks who they are, hears nobody, and is signed out, which is the true state of things. A safe outcome is handed back to
 * the HTTP boundary to log once there.
 */
export async function finishSignIn(request: Request): Promise<HttpRouteAnswer> {
  if (!(await loginAllowed(clientOf(request)))) return httpRouteAnswerFor(respondEmpty(429));

  const attempt = oauthAttemptFrom(request.headers.get("Cookie"));
  if (attempt === undefined) {
    return {response: respondEmpty(400), outcome: "sign_in_refused"};
  }

  const parameters = new URL(request.url).searchParams;
  const code = parameters.get("code");
  const failed = respondRedirect(attempt.returnTo, [clearedOauthCookie()]);
  if (code === null || parameters.get("state") !== attempt.state) {
    return {response: failed, outcome: "sign_in_refused"};
  }

  try {
    const googleSub = await googleSubjectOf({
      code,
      state: attempt.state,
      codeVerifier: attempt.codeVerifier,
      redirectUri: googleRedirectUri(request),
    });
    const now = new Date();
    const account = await findOrCreateAccount(googleSub, {
      id: crypto.randomUUID(),
      displayName: generatedDisplayName(Math.random),
      now,
    });
    const token = randomToken();

    await createSession({
      idHash: await hashSessionToken(token),
      userId: account.id,
      expiresAt: new Date(now.getTime() + SESSION_LIFETIME_SECONDS * 1000),
    });

    return httpRouteAnswerFor(respondRedirect(attempt.returnTo, [sessionCookie(token), clearedOauthCookie()]));
  } catch (error) {
    return {response: failed, outcome: "sign_in_failed", errorName: errorNameOf(error)};
  }
}
