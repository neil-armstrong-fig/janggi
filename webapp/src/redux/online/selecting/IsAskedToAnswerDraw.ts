import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Whether this player's screen is the one a draw offer is put to. In a game with a friend only the one who was **offered** the draw
 * is asked: the offerer's own screen has no answer to give. Anywhere else there is no army that is the player's own (`ownSide` is undefined), the one device is both players, and is asked.
 */
export function isAskedToAnswerDraw(friend: FriendSliceState, offeredBy: Side): boolean {
  if (friend.viewing !== "friend") return true;

  return offeredBy !== friend.ownSide;
}
