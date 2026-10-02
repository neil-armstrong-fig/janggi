import type {RouteServices} from "@src/handler/services/RouteServices";
import {SESSION_LIFETIME_SECONDS} from "@src/handler/session/SessionLifetime";
import {sessionCookie} from "@src/handler/session/SessionCookie";
import {clearedOauthCookie} from "@src/handler/oauth/ClearedOauthCookie";
import {oauthAttemptFrom} from "@src/handler/oauth/OAuthAttemptFrom";
import {clientOf} from "@src/handler/routes/ClientOf";
import {generatedDisplayName} from "@src/account/GeneratedDisplayName";
import {hashSessionToken} from "@src/handler/session/HashSessionToken";
import {randomToken} from "@src/handler/random/RandomToken";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";
import {respondRedirect} from "@src/handler/respond/RespondRedirect";

/**
 * `GET /api/auth/google/callback` — Google sending the player back. The attempt must be one this API started (the state
 * in the cookie is the one that came back), and Google must say who the player is; then they are given a session, and
 * a new account if Google's id has none, called by one of the generals.
 *
 * Whatever goes wrong, the player is sent back to the app with no session rather than shown an error page here: the
 * app asks who they are, hears nobody, and is signed out, which is the true state of things. The reason is logged.
 */
export async function finishSignIn(request: Request, services: RouteServices): Promise<Response> {
  if (!(await services.loginLimiter.allow(clientOf(request)))) return respondEmpty(429);

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
    console.error(
      `Sign-in refused: ${code === null ? `Google sent no code (error: ${parameters.get("error") ?? "none"})` : "the state did not match"}.`,
    );

    return failed;
  }

  try {
    const googleSub = await services.google.subjectOf({code, state: attempt.state, codeVerifier: attempt.codeVerifier});
    const now = services.now();
    const account = await services.store.findOrCreateAccount(googleSub, {
      id: crypto.randomUUID(),
      displayName: generatedDisplayName(services.random),
      now,
    });
    const token = randomToken();

    await services.store.createSession({
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
