/**
 * The WebSocket close code the room ends a connection with when it is **not there** — never made, or let go — as against
 * a connection that merely dropped. A browser cannot read the status of a refused upgrade, so the room accepts the socket and
 * closes it with this, which is how a player returning to a deleted room is told to stop trying (4000–4999 are for applications).
 */
export const ROOM_GONE_CLOSE_CODE = 4404;
