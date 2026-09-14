import type {BotTurn} from "@src/bot/types/BotTurn";
import type {GameState} from "@src/game/types/GameState";
import {applyMove} from "@src/game/ApplyMove";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {pass} from "@src/game/passing/Pass";
import {wouldCallBikjang} from "@src/bot/choice/would-call-bikjang/WouldCallBikjang";

/**
 * Whether a turn the bot might play leaves its opponent a bikjang the opponent would want to call.
 *
 * The engine searches with bikjang switched off, so it would open a file between the generals as
 * happily as any other — and in our rules that hands the opponent a draw, or a points decision, for the
 * asking. This is the one ply of foresight that makes up for it. The opponent's view of the game is the
 * bot's evaluation turned round.
 */
export function handsOpponentABikjang(state: GameState, turn: BotTurn, evaluation: number | undefined): boolean {
  if (turn.kind === "callBikjang") return false;

  const after = turn.kind === "move" ? applyMove(state, turn.move) : pass(state);
  if (!canCallBikjang(after)) return false;

  return wouldCallBikjang(after, after.sideToMove, evaluation === undefined ? undefined : -evaluation);
}
