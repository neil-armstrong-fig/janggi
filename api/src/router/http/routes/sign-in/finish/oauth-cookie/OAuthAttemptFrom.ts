import {isRecord} from "@src/json/IsRecord";
import type {OAuthAttempt} from "@src/router/http/routes/sign-in/oauth/types/OAuthAttempt";
import {OAUTH_COOKIE} from "@src/router/http/routes/sign-in/oauth/OAuthCookieName";

/** The attempt in a request's `Cookie` header, or undefined where there is none or it is not one this API wrote. */
export function oauthAttemptFrom(cookieHeader: string | undefined): OAuthAttempt | undefined {
  const pair = (cookieHeader ?? "")
    .split(";")
    .map(each => each.trim())
    .find(each => each.startsWith(`${OAUTH_COOKIE}=`));
  const value = pair?.slice(OAUTH_COOKIE.length + 1);
  if (!value) return undefined;

  try {
    const decoded: unknown = JSON.parse(atob(value.replaceAll("-", "+").replaceAll("_", "/")));
    if (!isRecord(decoded)) return undefined;

    const {state, codeVerifier, returnTo} = decoded;
    if (typeof state !== "string" || typeof codeVerifier !== "string" || typeof returnTo !== "string") return undefined;

    return {state, codeVerifier, returnTo};
  } catch {
    return undefined;
  }
}
