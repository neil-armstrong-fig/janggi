/**
 * The headers of the answer to a preflight: the CORS headers already worked out, with what the app is allowed to send.
 *
 * A sync write is JSON with an `If-Match`, so the browser asks first; without the max age it asks again within seconds, and
 * every sync costs the free plan a third request. Browsers cap the time at two hours.
 */
export function preflightHeaders(cors: Headers): Headers {
  const headers = new Headers(cors);
  headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
  headers.set("Access-Control-Allow-Headers", "Content-Type, If-Match");
  headers.set("Access-Control-Max-Age", "7200");

  return headers;
}
