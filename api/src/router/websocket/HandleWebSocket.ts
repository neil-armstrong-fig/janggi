import {allowedOrigins} from "@src/router/shared/origin/AllowedOrigins";
import {forwardToRoom} from "@src/router/websocket/room-socket/ForwardToRoom";
import {isTrustedOrigin} from "@src/router/shared/origin/IsTrustedOrigin";
import {logApiEvent} from "@src/observability/LogApiEvent";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {signedInAccount} from "@src/router/shared/session/SignedInAccount";
import {socketRouteOf} from "@src/router/websocket/room-socket/SocketRouteOf";

/**
 * Answers a WebSocket upgrade, in order: it must be for a room's socket (404), come from the site (403) and carry a session (401);
 * then it is handed to the room. **The origin check is here and not in `http/`'s CSRF step**, because a browser sends no CORS
 * preflight for a WebSocket and a page anywhere may open one — it is what stops a page somebody else wrote from using a player's
 * cookie. No CORS headers are added: the answer comes from the room, whose headers cannot be changed, and a browser does not ask CORS
 * of a WebSocket.
 */
export async function handleWebSocket(request: Request): Promise<Response> {
  const code = socketRouteOf(new URL(request.url).pathname);
  if (request.method !== "GET" || code === undefined) {
    const response = respondEmpty(404);

    logApiEvent({
      event: "api_request",
      route: "unknown",
      transport: "websocket",
      outcome: "invalid_socket_route",
      status: 404,
    });
    return response;
  }

  if (!isTrustedOrigin(request.headers.get("Origin"), allowedOrigins())) {
    const response = respondEmpty(403);

    logApiEvent({
      event: "api_request",
      route: "room_socket",
      transport: "websocket",
      outcome: "origin_rejected",
      status: 403,
    });
    return response;
  }

  const account = await signedInAccount(request);
  if (account === undefined) {
    const response = respondEmpty(401);

    logApiEvent({
      event: "api_request",
      route: "room_socket",
      transport: "websocket",
      outcome: "unsigned",
      status: 401,
    });
    return response;
  }

  const response = await forwardToRoom(request, account, code);

  logApiEvent({
    event: "api_request",
    route: "room_socket",
    transport: "websocket",
    outcome: "forwarded",
    status: response.status,
  });
  return response;
}
