import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What a host asked a room for: their army, and how long it may sit with both away. */
export interface RoomAsked {
  readonly side: Side;
  readonly awayDays: RoomAwayDays;
}
