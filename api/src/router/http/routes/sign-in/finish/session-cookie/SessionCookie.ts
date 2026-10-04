import {SESSION_COOKIE} from "@src/router/shared/session/SessionCookieName";
import {SESSION_LIFETIME_SECONDS} from "@src/router/http/routes/sign-in/finish/session-cookie/SessionLifetime";

/**
 * The `Set-Cookie` value that starts a session. `HttpOnly` so no script on the page can read it, `Secure` so it
 * only travels over HTTPS, and `SameSite=Lax` because the site and this API share a registrable domain, which makes
 * them same-site: the cookie rides along on the page's own `fetch` calls, and not on a request another site makes.
 */
export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_LIFETIME_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}
