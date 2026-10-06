import type {RoomRequest} from "@src/room/request/types/RoomRequest";
import {ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import {ROOM_OBJECT_CALL} from "@src/room/request/RoomObjectCall";
import {isRecord} from "@src/json/IsRecord";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";

/**
 * The request the Worker made of a room (`OpenRoom` and `ConnectToRoom` make it, in the shape `ROOM_OBJECT_CALL` names), read as untrusted: nothing reaches a
 * room's storage that was not checked here. A request for something else is `unknown` (a 404), one for something it
 * understands but cannot read is `malformed` (a 400).
 */
export async function roomRequestFrom(request: Request): Promise<RoomRequest> {
  const path = new URL(request.url).pathname;
  if (path === ROOM_OBJECT_CALL.socketPath) return socketRequestFrom(request);
  if (path !== ROOM_OBJECT_CALL.openPath || request.method !== "POST") return {kind: "unknown"};

  return openRequestFrom(await request.json().catch(() => undefined));
}

/** A player's socket, for the account the Worker named; with none named it is nothing the room serves. */
function socketRequestFrom(request: Request): RoomRequest {
  const accountId = request.headers.get(ROOM_OBJECT_CALL.accountHeader) ?? undefined;
  if (accountId === undefined || accountId === "") return {kind: "unknown"};

  return {kind: "socket", accountId};
}

function openRequestFrom(body: unknown): RoomRequest {
  if (!isRecord(body)) return {kind: "malformed"};

  const hostSide = SIDES.find(each => each === body["hostSide"]);
  const awayDays = ROOM_AWAY_DAYS.find(each => each === body["awayDays"]);
  const code = body["code"];
  if (hostSide === undefined || awayDays === undefined || typeof code !== "string" || code === "") {
    return {kind: "malformed"};
  }

  return {kind: "open", code, hostSide, awayDays};
}
