import {SESSION_COOKIE} from "@src/router/shared/session/SessionCookieName";

/** The `Set-Cookie` value that ends a session in the browser. */
export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
