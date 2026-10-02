import {OAUTH_COOKIE} from "@src/handler/oauth/OAuthCookieName";

/** The `Set-Cookie` that ends an attempt, once it has been used or has failed. */
export function clearedOauthCookie(): string {
  return `${OAUTH_COOKIE}=; Path=/api/auth/google; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
