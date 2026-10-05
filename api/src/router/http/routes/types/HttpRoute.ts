/**
 * Every route the API answers over plain HTTP, written as `<METHOD> <path>`. The one list: a route is matched only if it is
 * here (`httpRouteOf`), and answered only where `answerHttpRoute` has a case for it — a route in this list with no case is
 * a compile error. The room's WebSocket is not here: it is the other flow (`websocket/`).
 */
export const HTTP_ROUTES = [
  "GET /api/auth/google",
  "GET /api/auth/google/callback",
  "POST /api/auth/logout",
  "GET /api/me",
  "PATCH /api/me",
  "GET /api/data",
  "PUT /api/data",
  "POST /api/rooms",
  "PUT /api/push-subscription",
  "DELETE /api/push-subscription",
  "DELETE /api/account",
] as const;

export type HttpRoute = (typeof HTTP_ROUTES)[number];
