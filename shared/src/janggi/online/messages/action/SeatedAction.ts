import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What was done, and by which army — one entry of the list a room replays to bring a player back into a game. */
export interface SeatedAction {
  readonly by: Side;
  readonly action: RoomAction;
}
