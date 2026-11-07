import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What a host asks for: their army, and how many days both may be away before the room is let go. */
export interface NewFriendRoom {
  readonly side: Side;
  readonly awayDays: RoomAwayDays;
}
