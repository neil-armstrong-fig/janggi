/**
 * Where to send the player once they are signed in: the address the app asked to be brought back to, if it is on one
 * of the sites allowed to ask, and otherwise the first of them.
 *
 * Checked by origin, as a whole, never by prefix — an open redirect here would let any page use the API's sign-in to
 * send somebody on to a site of its own. Anything that is not a URL is ignored rather than refused, since the player
 * is mid-way through signing in and a plain return to the site is a better answer than an error.
 */
export function returnAddress(asked: string | null, allowedOrigins: readonly string[]): string {
  const fallback = `${allowedOrigins[0] ?? ""}/`;
  if (asked === null) return fallback;

  try {
    const address = new URL(asked);
    if (!allowedOrigins.includes(address.origin)) return fallback;

    return address.href;
  } catch {
    return fallback;
  }
}
