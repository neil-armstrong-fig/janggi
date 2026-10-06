import {allowedOrigins} from "@src/router/shared/origin/AllowedOrigins";
import {answerHttpRoute} from "@src/router/http/routes/AnswerHttpRoute";
import {corsHeadersFor} from "@src/router/http/cors/CorsHeadersFor";
import {httpRouteOf} from "@src/router/http/routes/HttpRouteOf";
import {isForgedChange} from "@src/router/http/cors/IsForgedChange";
import {logApiEvent} from "@src/observability/LogApiEvent";
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
  const origin = request.headers.get("Origin") ?? undefined;
  const cors = corsHeadersFor(origin, allowedOrigins());

  if (request.method === "OPTIONS") {
    const response = new Response(undefined, {status: 204, headers: preflightHeaders(cors)});

    logApiEvent({event: "api_request", route: "preflight", transport: "http", outcome: "preflight", status: 204});
    return response;
  }

  const route = httpRouteOf(request.method, new URL(request.url).pathname);
  if (route === undefined) {
    const response = withHeaders(respondEmpty(404), cors);

    logApiEvent({event: "api_request", route: "unknown", transport: "http", outcome: "unknown_route", status: 404});
    return response;
  }

  if (isForgedChange(request.method, origin, allowedOrigins())) {
    const response = withHeaders(respondEmpty(403), cors);

    logApiEvent({event: "api_request", route, transport: "http", outcome: "forged_change", status: 403});
    return response;
  }

  const answer = await answerHttpRoute(route, request);
  const response = withHeaders(answer.response, cors);

  if (answer.outcome === "sign_in_failed") {
    logApiEvent({
      event: "api_request",
      route,
      transport: "http",
      outcome: answer.outcome,
      status: response.status,
      errorName: answer.errorName,
    });
  } else {
    logApiEvent({event: "api_request", route, transport: "http", outcome: answer.outcome, status: response.status});
  }

  return response;
}

function withHeaders(response: Response, headers: Headers): Response {
  headers.forEach((value, name) => response.headers.set(name, value));

  return response;
}
