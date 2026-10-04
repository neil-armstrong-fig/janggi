import type {RoomState} from "@src/room/types/RoomState";
import type {Delivery} from "@src/room/types/Delivery";

/** What the room became and what it says about that — the whole of what one thing happening to a room comes to. */
export interface RoomStep {
  readonly state: RoomState;
  readonly deliveries: readonly Delivery[];
}
