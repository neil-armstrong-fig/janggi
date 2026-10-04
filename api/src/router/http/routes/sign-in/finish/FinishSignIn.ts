import {createSession} from "@src/database/sessions/CreateSession";
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

/**
 * `GET /api/auth/google/callback` — Google sending the player back. The attempt must be one this API started (the state
 * in the cookie is the one that came back), and Google must say who the player is; then they are given a session, and
 * a new account if Google's id has none, called by one of the generals.
 *
 * Whatever goes wrong, the player is sent back to the app with no session rather than shown an error page here: the
 * app asks who they are, hears nobody, and is signed out, which is the true state of things. The reason is logged.
 */
export async function finishSignIn(request: Request): Promise<Response> {
  if (!(await loginAllowed(clientOf(request)))) return respondEmpty(429);

  const attempt = oauthAttemptFrom(request.headers.get("Cookie"));
  if (attempt === undefined) {
    console.error(
      "Sign-in refused: the callback carried no attempt cookie, so it is not one this API started (or the browser dropped the cookie).",
    );

    return respondEmpty(400);
  }

  const parameters = new URL(request.url).searchParams;
  const code = parameters.get("code");
  const failed = respondRedirect(attempt.returnTo, [clearedOauthCookie()]);
  if (code === null || parameters.get("state") !== attempt.state) {
    console.error(`Sign-in refused: ${refusalReason(parameters)}.`);

    return failed;
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

    return respondRedirect(attempt.returnTo, [sessionCookie(token), clearedOauthCookie()]);
  } catch (error) {
    // Said where only the Worker's own logs can see it: why Google or the database refused is what somebody setting this up
    // needs, and the player, sent back signed out, can do nothing with it. Nothing secret is in an error from either.
    console.error("Sign-in failed:", error);

    return failed;
  }
}

/** Why a sign-in was turned away: Google sent no code, or the state it sent back was not the one this player started with. */
function refusalReason(parameters: URLSearchParams): string {
  if (parameters.get("code") === null) return `Google sent no code (error: ${parameters.get("error") ?? "none"})`;

  return "the state did not match";
}
