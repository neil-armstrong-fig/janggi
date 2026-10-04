import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {RoomTimings} from "@src/room/alarm/types/RoomTimings";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/** A friend has a day to open the link. */
const UNJOINED = DAY;

/** A finished room is kept briefly, so a player who reconnects is still told how it ended. */
const FINISHED = 2 * MINUTE;

/** The room's timings, with how long both players may be away set by the host (`RoomAwayDays`). */
export function roomTimingsFor(awayDays: RoomAwayDays): RoomTimings {
  return {unjoined: UNJOINED, away: awayDays * DAY, finished: FINISHED};
}
