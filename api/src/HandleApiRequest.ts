import type {HttpRoute} from "@src/router/http/routes/types/HttpRoute";
import {errorNameOf} from "@src/observability/ErrorNameOf";
import {httpRouteOf} from "@src/router/http/routes/HttpRouteOf";
import {isWebSocketUpgrade} from "@src/router/upgrade/IsWebSocketUpgrade";
import {logApiEvent} from "@src/observability/LogApiEvent";
import {missingSecrets} from "@src/env/MissingSecrets";
import {routeRequest} from "@src/router/RouteRequest";
import {socketRouteOf} from "@src/router/websocket/room-socket/SocketRouteOf";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

type HttpLogRoute = HttpRoute | "preflight" | "unknown";

type RequestLogContext =
  | {readonly route: HttpLogRoute; readonly transport: "http"}
  | {readonly route: "room_socket" | "unknown"; readonly transport: "websocket"};

/** The complete top-level request boundary, apart from the Worker's runtime export. */
export async function handleApiRequest(request: Request): Promise<Response> {
  const requestLogContext = requestLogContextOf(request);
  const missing = missingSecrets(workerEnvironment);
  if (missing.length > 0) {
    logApiEvent({
      event: "api_request",
      ...requestLogContext,
      outcome: "missing_configuration",
      status: 500,
    });

    return Response.json({}, {status: 500});
  }

  try {
    return await routeRequest(request);
  } catch (error) {
    logApiEvent({
      event: "api_request",
      ...requestLogContext,
      outcome: "unexpected_failure",
      status: 500,
      errorName: errorNameOf(error),
    });

    throw error;
  }
}

function requestLogContextOf(request: Request): RequestLogContext {
  if (isWebSocketUpgrade(request)) {
    return {route: webSocketLogRouteOf(request), transport: "websocket"};
  }

  if (request.method === "OPTIONS") return {route: "preflight", transport: "http"};

  const route = httpRouteOf(request.method, new URL(request.url).pathname);
  if (route === undefined) return {route: "unknown", transport: "http"};

  return {route, transport: "http"};
}

function webSocketLogRouteOf(request: Request): "room_socket" | "unknown" {
  if (request.method !== "GET") return "unknown";

  try {
    const code = socketRouteOf(new URL(request.url).pathname);
    if (code === undefined) return "unknown";

    return "room_socket";
  } catch {
    return "unknown";
  }
}
