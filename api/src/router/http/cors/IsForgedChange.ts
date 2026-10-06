import {isTrustedOrigin} from "@src/router/shared/origin/IsTrustedOrigin";

/** The methods that change something, and so must come from the site and not from a page somebody else wrote. */
const CHANGING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

/**
 * Whether a request changes something and does not come from the site — a forged cross-site request (CSRF), refused before
 * anything is done. `SameSite=Lax` on the cookie is a second line; this is the first.
 */
export function isForgedChange(method: string, origin: string | undefined, allowedOrigins: readonly string[]): boolean {
  return CHANGING_METHODS.includes(method) && !isTrustedOrigin(origin, allowedOrigins);
}
