import {isRecord} from "@src/json/IsRecord";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import type {Account} from "@src/database/types/Account";
import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import {DEFAULT_ROOM_AWAY_DAYS, ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {MAX_OPEN_ROOMS} from "@src/router/http/routes/open-room/limits/MaxOpenRooms";
import {staleRoomAfter} from "@src/room/alarm/StaleRoomAfter";
import {mintFriendCode} from "@src/router/http/routes/open-room/friend-code/MintFriendCode";
import {ROOM_OBJECT_CALL} from "@src/room/request/RoomObjectCall";
import {closeRoomRecord} from "@src/database/rooms/CloseRoomRecord";
import {openRoomRecord} from "@src/database/rooms/OpenRoomRecord";
import {roomOpeningAllowed} from "@src/router/http/routes/rate-limit/RoomOpeningAllowed";
import {respondEmpty} from "@src/router/shared/respond/RespondEmpty";
import {respondJson} from "@src/router/http/routes/respond/RespondJson";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** A body is `{side, awayDays}` and nothing else that matters: a few dozen characters. */
const MAX_BODY_LENGTH = 1_000;

/** Codes drawn before giving up, in case one is taken: at 31^8 of them a second draw is already a very bad day. */
const DRAWS = 5;

/**
 * `POST /api/rooms` — the host asks for a room on a side, and for how many days both may be away before it is let go (90, the longest, where they do not say), and is given its friend code (201 `{code}`). A player has one room
 * open at a time (409), there is a ceiling on rooms overall (503), and it is rate-limited by account (429). The code is
 * recorded before the room is made, and forgotten if the room cannot be.
 */
export async function openRoom(request: Request, account: Account): Promise<Response> {
  if (!(await roomOpeningAllowed(account.id))) return respondEmpty(429);

  const choice = await choiceIn(request);
  if (choice === undefined) return respondEmpty(400);

  for (let draw = 0; draw < DRAWS; draw++) {
    const code = mintFriendCode(length => crypto.getRandomValues(new Uint8Array(length)));
    const opening = await openRoomRecord({
      code,
      hostId: account.id,
      now: new Date(),
      limit: MAX_OPEN_ROOMS,
      staleAfter: staleRoomAfter(),
    });

    if (opening.kind === "already-open") return respondJson({code: opening.code}, 409);
    if (opening.kind === "full") return respondEmpty(503);
    if (opening.kind === "code-taken") continue;

    if (!(await madeRoom(code, choice))) {
      await closeRoomRecord(code);

      return respondEmpty(502);
    }

    return respondJson({code}, 201);
  }

  return respondEmpty(503);
}

/** Makes the room: the Durable Object named by the code, told whose it is, which army its host plays and how long it is kept. */
async function madeRoom(code: string, {side, awayDays}: RoomChoice): Promise<boolean> {
  const rooms = workerEnvironment.GAME_ROOMS;

  try {
    const made = await rooms
      .get(rooms.idFromName(code))
      .fetch(`${ROOM_OBJECT_CALL.address}${ROOM_OBJECT_CALL.openPath}`, {
        method: "POST",
        body: JSON.stringify({code, hostSide: side, awayDays}),
      });

    return made.ok;
  } catch {
    return false;
  }
}

/** What the host asked for. */
interface RoomChoice {
  readonly side: Side;
  readonly awayDays: RoomAwayDays;
}

/** The side, and how long both may be away — the default where they said nothing, and nothing at all where what they said is not one of the choices. */
async function choiceIn(request: Request): Promise<RoomChoice | undefined> {
  const text = await request.text();
  if (text.length > MAX_BODY_LENGTH) return undefined;

  try {
    const body: unknown = JSON.parse(text);
    if (!isRecord(body)) return undefined;

    const side = SIDES.find(each => each === body["side"]);
    const awayDays = awayDaysIn(body["awayDays"]);
    if (side === undefined || awayDays === undefined) return undefined;

    return {side, awayDays};
  } catch {
    return undefined;
  }
}

/** How many days both may be away: the default where the host said nothing, and nothing at all where what they said is not one of the choices. */
function awayDaysIn(asked: unknown): RoomAwayDays | undefined {
  if (asked === undefined) return DEFAULT_ROOM_AWAY_DAYS;

  return ROOM_AWAY_DAYS.find(each => each === asked);
}
