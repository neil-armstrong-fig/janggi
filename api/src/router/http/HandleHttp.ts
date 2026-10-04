import {allowedOrigins} from "@src/router/shared/origin/AllowedOrigins";
import {answerHttpRoute} from "@src/router/http/routes/AnswerHttpRoute";
import {corsHeadersFor} from "@src/router/http/cors/CorsHeadersFor";
import {httpRouteOf} from "@src/router/http/routes/HttpRouteOf";
import {isForgedChange} from "@src/router/http/cors/IsForgedChange";
import {preflightHeaders} from "@src/router/http/cors/PreflightHeaders";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";

/**
 * Answers a plain HTTP request to the API, in the order that matters: a preflight, then a 404 for anything that is not a route the
 * API serves (nothing else about it is looked at), then the refusal of a forged cross-site change (CSRF), then the route. Each
 * decision is its own function; this only puts them in order.
 *
 * An answer has the CORS headers added to it last, so no route can forget them.
 */
export async function handleHttp(request: Request): Promise<Response> {
  const origin = request.headers.get("Origin");
  const cors = corsHeadersFor(origin, allowedOrigins());

  if (request.method === "OPTIONS") {
    return new Response(null, {status: 204, headers: preflightHeaders(cors)});
  }

  const route = httpRouteOf(request.method, new URL(request.url).pathname);
  if (route === undefined) {
    return withHeaders(respondEmpty(404), cors);
  }

  if (isForgedChange(request.method, origin, allowedOrigins())) {
    return withHeaders(respondEmpty(403), cors);
  }

  return withHeaders(await answerHttpRoute(route, request), cors);
}

function withHeaders(response: Response, headers: Headers): Response {
  headers.forEach((value, name) => response.headers.set(name, value));

  return response;
}
