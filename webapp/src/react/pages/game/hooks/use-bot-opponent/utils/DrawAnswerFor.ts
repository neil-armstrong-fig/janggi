import type {GameState} from "@src/game/types/GameState";
import type {UnknownAction} from "@reduxjs/toolkit";
import {drawAccepted, drawDeclined} from "@src/redux/game/GameSlice";
import {wouldAcceptADraw} from "@src/bot/choice/would-accept-a-draw/WouldAcceptADraw";

/**
 * What the bot answers a draw offered to it, as the store action a person's tap on Accept or Decline
 * would dispatch. `evaluation` is what the engine made of the position on its last turn, in centipawns
 * from the bot's side, or undefined where it has not searched yet — `wouldAcceptADraw` has why that
 * decides it.
 *
 * Separate from `botReplyFor`: replying to the position is a search that takes as long as the engine
 * takes, while an answer is a judgement on what it already knows, and the game is not waiting on the
 * bot's army while it is asked — the player has just offered, and it is still their turn.
 */
export function drawAnswerFor(game: GameState, evaluation: number | undefined): UnknownAction {
  return wouldAcceptADraw(game, evaluation) ? drawAccepted() : drawDeclined();
}
