/**
 * How the Worker calls a room's Durable Object, and so how the room reads the call (`roomRequestFrom`): the one place the two
 * halves agree. The address never leaves Cloudflare, so only its path matters.
 */
export const ROOM_OBJECT_CALL = {
  address: "https://game-room",
  openPath: "/open",
  socketPath: "/socket",
  accountHeader: "X-Account-Id",
} as const;
