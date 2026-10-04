import {handleHttp} from "@src/router/http/HandleHttp";
import {handleWebSocket} from "@src/router/websocket/HandleWebSocket";
import {isWebSocketUpgrade} from "@src/router/upgrade/IsWebSocketUpgrade";

/**
 * The first fork of a request, and the only one: a request that asks to become a WebSocket goes to `websocket/`, anything else to
 * `http/`. Each flow is answerable for everything beneath it.
 */
export function routeRequest(request: Request): Promise<Response> {
  if (isWebSocketUpgrade(request)) return handleWebSocket(request);

  return handleHttp(request);
}
