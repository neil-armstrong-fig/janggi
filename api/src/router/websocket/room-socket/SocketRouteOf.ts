import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";

const ROOM_SOCKET_PATH = /^\/api\/rooms\/([^/]+)\/socket$/;

/**
 * The friend code a room's socket path is for, or undefined where the path is for none: not `/api/rooms/<code>/socket`, or a
 * `<code>` that is not one. A code is read as a friend reads it out — any case, a space or hyphen between its halves.
 */
export function socketRouteOf(pathname: string): FriendCode | undefined {
  const typed = ROOM_SOCKET_PATH.exec(pathname)?.[1];
  if (typed === undefined) return undefined;

  return parseFriendCode(decodeURIComponent(typed));
}
