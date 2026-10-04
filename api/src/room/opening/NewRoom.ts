import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {RoomState} from "@src/room/types/RoomState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** A room nobody has sat down in: the host will be `hostSide` when they do, the guest the other, and both may be away `awayDays` before it is let go. */
export function newRoom(hostSide: Side, now: number, awayDays: RoomAwayDays): RoomState {
  return {hostSide, awayDays, createdAt: now, seats: [], history: []};
}
