import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What the Worker may ask of a room, as it was understood: to be made, or to take a player's socket. */
export type RoomRequest =
  | {readonly kind: "open"; readonly code: string; readonly hostSide: Side; readonly awayDays: RoomAwayDays}
  | {readonly kind: "socket"; readonly accountId: string}
  | {readonly kind: "unknown"}
  | {readonly kind: "malformed"};
