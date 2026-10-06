/**
 * Whether a request's `Origin` header names a site this API serves.
 *
 * Compared as a whole string against the list, never as a prefix — `https://janggi.neilarmstrong.dev.evil.example`
 * starts with the site's origin and must not pass. A request with no `Origin` is refused: a browser always
 * sends one on a state-changing cross-site request, so its absence means something else is calling.
 */
export function isTrustedOrigin(origin: string | undefined, allowedOrigins: readonly string[]): boolean {
  return origin !== undefined && allowedOrigins.includes(origin);
}
