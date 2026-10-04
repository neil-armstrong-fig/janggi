import {allowedOrigins} from "@src/router/shared/origin/AllowedOrigins";
import {forwardToRoom} from "@src/router/websocket/room-socket/ForwardToRoom";
import {isTrustedOrigin} from "@src/router/shared/origin/IsTrustedOrigin";
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
    return respondEmpty(404);
  }

  if (!isTrustedOrigin(request.headers.get("Origin"), allowedOrigins())) {
    return respondEmpty(403);
  }

  const account = await signedInAccount(request);
  if (account === undefined) return respondEmpty(401);

  return forwardToRoom(request, account, code);
}
