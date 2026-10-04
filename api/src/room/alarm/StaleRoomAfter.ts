import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import {ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import {roomTimingsFor} from "@src/room/alarm/RoomTimingsFor";

const DAY = 24 * 60 * 60_000;

/** How long the database's record of a host's room is trusted: longer than any room can live, whatever its host chose. */
export function staleRoomAfter(): number {
  const longest = roomTimingsFor(Math.max(...ROOM_AWAY_DAYS) as RoomAwayDays);

  return longest.unjoined + longest.away + longest.finished + DAY;
}
