/**
 * Where the sign-in and sync API lives unless a build is pointed elsewhere (`VITE_API_ORIGIN`). The app calls it
 * and the acceptance tests stand in for it at this address, so the two cannot disagree about where it is.
 *
 * One label below the domain, not two: Cloudflare's free universal certificate covers `neilarmstrong.dev` and
 * `*.neilarmstrong.dev`, and a name like `api.janggi.neilarmstrong.dev` is a level too deep for it, so browsers fail the
 * handshake (Firefox: SSL_ERROR_NO_CYPHER_OVERLAP). Still under the site's own registrable domain, so the session cookie
 * is same-site.
 */
export const API_ORIGIN = "https://janggi-api.neilarmstrong.dev";
