import type {FriendGameState} from "@janggi/shared/janggi/online/FriendGameState";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {GameState} from "@janggi/engine/types/GameState";
import {outcomeOf} from "@janggi/engine/OutcomeOf";

/**
 * Where the friend game stands. The room's word, except that a game the board has decided — a checkmate, an agreed draw, points —
 * is over: the room says nothing of those, since it is the engine's own judgement and both sides run the engine.
 */
export function friendStateOf(friend: FriendSliceState, game: GameState): FriendGameState {
  if (friend.state !== "playing" && friend.state !== "opponent-left") return friend.state;
  if (outcomeOf(game).kind === "undecided") return friend.state;

  return "over";
}
