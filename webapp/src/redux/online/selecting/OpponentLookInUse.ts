import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {OpponentLook} from "@src/redux/online/types/OpponentLook";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {inFriendGame} from "@src/redux/online/selecting/InFriendGame";

/** The friend's look and which army is the player's, to draw a game with. */
export interface OpponentLookInUse {
  readonly ownSide: Side;
  readonly look: OpponentLook;
}

/**
 * The look a game is to be drawn in, if it is to be the friend's: only in a game with a friend, only with the friend's look sent, and
 * only where the player has not turned showing it off. Otherwise nothing, and the player's own look is drawn.
 */
export function opponentLookInUse(friend: FriendSliceState, shown: boolean): OpponentLookInUse | undefined {
  if (!shown || !inFriendGame(friend)) return undefined;
  if (friend.opponent === undefined || friend.ownSide === undefined) return undefined;

  return {ownSide: friend.ownSide, look: friend.opponent};
}
