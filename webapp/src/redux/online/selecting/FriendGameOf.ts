import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";

/** The game with the friend: the one on the board when it is the one shown, and the one that waits when the player's own is. */
export function friendGameOf(friend: FriendSliceState, onTheBoard: GameSliceState): GameSliceState {
  if (friend.viewing === "friend") return onTheBoard;

  return friend.parkedGame ?? onTheBoard;
}
