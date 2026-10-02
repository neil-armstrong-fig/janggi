import {isTrustedOrigin} from "@src/handler/cors/IsTrustedOrigin";

/**
 * The CORS headers an answer carries. The site lives on a different origin from this API, and the session
 * is a cookie, so the browser only hands the answer over when the origin is named exactly and credentials
 * are allowed — a wildcard is refused alongside credentials. An origin that is not listed gets none of it.
 */
export function corsHeadersFor(origin: string | null, allowedOrigins: readonly string[]): Headers {
  const headers = new Headers({Vary: "Origin"});

  if (origin !== null && isTrustedOrigin(origin, allowedOrigins)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }

  return headers;
}
