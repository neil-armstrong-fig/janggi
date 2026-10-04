import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {GameState} from "@janggi/engine/types/GameState";
import {friendStateOf} from "@src/redux/online/selecting/FriendStateOf";

/**
 * Whether this player may move, rest, call or offer now: the game is on, and it is their army's turn. While the friend is
 * away the game is on still — the room holds their place — so a move made then is sent and waits for them. While this
 * player's own link is down nothing can be sent, so nothing is offered.
 */
export function mayActInFriendGame(friend: FriendSliceState, game: GameState): boolean {
  if (friend.connection === "reconnecting") return false;
  if (game.sideToMove !== friend.ownSide) return false;

  const state = friendStateOf(friend, game);
  return state === "playing" || state === "opponent-left";
}
