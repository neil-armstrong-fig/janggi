import type {GameState} from "@src/game/types/GameState";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {wouldCallBikjang} from "@src/bot/choice/would-call-bikjang/WouldCallBikjang";

/**
 * Whether the bot, to move, calls the bikjang in front of it rather than playing on — asked before the
 * engine is, since a call is not a move the engine knows.
 *
 * `evaluation` is the engine's most recent view of the game from the bot's side, in centipawns, or
 * undefined before it has searched anything.
 */
export function shouldCallBikjang(state: GameState, evaluation: number | undefined): boolean {
  return canCallBikjang(state) && wouldCallBikjang(state, state.sideToMove, evaluation);
}
