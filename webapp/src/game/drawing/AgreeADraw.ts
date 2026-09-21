import type {GameState} from "@src/game/types/GameState";
import {canAgreeADraw} from "@src/game/drawing/CanAgreeADraw";

/**
 * The game after both players agree to a draw: every piece exactly where it stood, nobody's turn
 * taken, and the game stopped.
 *
 * It says nothing of who offered or who accepted. That is a conversation between two players, or a
 * player and the bot, and it leaves nothing on the board — so it is the page's to hold until it comes
 * to yes, and this is only the yes. See `docs/rules.md` §6.4.
 *
 * **Throws** when there is nothing to agree to, exactly as `callBikjang` throws — the caller has just
 * been told by `canAgreeADraw`.
 */
export function agreeADraw(state: GameState): GameState {
  if (!canAgreeADraw(state)) throw new Error("A draw may be agreed in a casual game that is still being played");

  return {...state, drawAgreed: true};
}
