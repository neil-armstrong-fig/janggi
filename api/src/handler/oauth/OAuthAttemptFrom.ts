import type {OAuthAttempt} from "@src/handler/oauth/types/OAuthAttempt";
import {OAUTH_COOKIE} from "@src/handler/oauth/OAuthCookieName";

/** The attempt in a request's `Cookie` header, or undefined where there is none or it is not one this API wrote. */
export function oauthAttemptFrom(cookieHeader: string | null): OAuthAttempt | undefined {
  const pair = (cookieHeader ?? "")
    .split(";")
    .map(each => each.trim())
    .find(each => each.startsWith(`${OAUTH_COOKIE}=`));
  const value = pair?.slice(OAUTH_COOKIE.length + 1);
  if (!value) return undefined;

  try {
    const decoded: unknown = JSON.parse(atob(value.replaceAll("-", "+").replaceAll("_", "/")));

    if (typeof decoded !== "object" || decoded === null) return undefined;

    const {state, codeVerifier, returnTo} = decoded as Record<string, unknown>;

    return typeof state === "string" && typeof codeVerifier === "string" && typeof returnTo === "string"
      ? {state, codeVerifier, returnTo}
      : undefined;
  } catch {
    return undefined;
  }
}
