import type {Account} from "@src/database/types/Account";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {ROOM_OBJECT_CALL} from "@src/room/request/RoomObjectCall";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * Hands a player's WebSocket upgrade to the room: the Durable Object named by the code, told whose it is. Answers what the room
 * answers — the accepted socket, or one closed saying the room is not there (`ROOM_GONE_CLOSE_CODE`).
 */
export function forwardToRoom(request: Request, account: Account, code: FriendCode): Promise<Response> {
  const upgrade = new Request(`${ROOM_OBJECT_CALL.address}${ROOM_OBJECT_CALL.socketPath}`, request);
  upgrade.headers.set(ROOM_OBJECT_CALL.accountHeader, account.id);

  const rooms = workerEnvironment.GAME_ROOMS;

  return rooms.get(rooms.idFromName(code)).fetch(upgrade);
}
