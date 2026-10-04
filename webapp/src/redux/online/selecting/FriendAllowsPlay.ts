import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {GameState} from "@janggi/engine/types/GameState";
import {mayActInFriendGame} from "@src/redux/online/selecting/MayActInFriendGame";
import {withAFriend} from "@src/redux/online/selecting/WithAFriend";

/** Whether a game with a friend lets this player move, rest, call or offer now. Any other game has nothing to say about it. */
export function friendAllowsPlay(friend: FriendSliceState, game: GameState): boolean {
  if (!withAFriend(friend)) return true;

  return mayActInFriendGame(friend, game);
}
