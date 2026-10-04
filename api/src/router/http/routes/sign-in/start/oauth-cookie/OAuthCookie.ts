import type {OAuthAttempt} from "@src/router/http/routes/sign-in/oauth/types/OAuthAttempt";
import {OAUTH_COOKIE} from "@src/router/http/routes/sign-in/oauth/OAuthCookieName";

/** Long enough for somebody to read Google's consent screen, no longer. */
const ATTEMPT_LIFETIME_SECONDS = 600;

/**
 * The `Set-Cookie` that holds an attempt. Limited to the callback's path so no other request carries it, `HttpOnly` so
 * no script can read the verifier, and `SameSite=Lax` — Google sends the player back with a top-level GET, which Lax
 * allows, and which is the only way the cookie is wanted.
 */
export function oauthCookie(attempt: OAuthAttempt): string {
  const value = btoa(JSON.stringify(attempt)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

  return `${OAUTH_COOKIE}=${value}; Path=/api/auth/google; Max-Age=${ATTEMPT_LIFETIME_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}
