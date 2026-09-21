import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {positionAfter} from "@src/game/utils/PositionAfter";

/**
 * Whether a move would leave the opponent a bikjang to call — the question a board asks *before* the
 * move, where `canCallBikjang` is asked after it. See `docs/rules.md` §6.2.
 *
 * It is `canCallBikjang` put to the position the move leaves rather than `isBikjang`, so the answer
 * is the format's own: casually any two generals facing are a risk, while a scored game says nothing
 * until both armies are under thirty, nor of a general that took its way onto the file —
 * `positionAfter` records that for exactly the one ply the exception lasts.
 *
 * It checks nothing about the move itself. A caller asking about a point `movesFrom` did not offer
 * gets an answer about a move the rules would refuse.
 */
export function canCallBikjangAfter(state: GameState, move: Move): boolean {
  return canCallBikjang(positionAfter(state, move));
}
