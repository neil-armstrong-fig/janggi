/** Whether a request asks to become a WebSocket: it says `Upgrade: websocket`, in any case. The one thing that sends a request down the websocket flow and not the http one. */
export function isWebSocketUpgrade(request: Request): boolean {
  return request.headers.get("Upgrade")?.toLowerCase() === "websocket";
}
