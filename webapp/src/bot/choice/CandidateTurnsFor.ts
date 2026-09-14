import type {BotTurn} from "@src/bot/types/BotTurn";
import type {GameState} from "@src/game/types/GameState";
import {canPass} from "@src/game/passing/CanPass";
import {handsOpponentABikjang} from "@src/bot/choice/hands-opponent-a-bikjang/HandsOpponentABikjang";
import {legalMovesFor} from "@src/game/LegalMovesFor";

/**
 * Every turn the engine may choose between — the list its search is restricted to.
 *
 * **This is what keeps the bot inside our rules.** Fairy-Stockfish's janggi is not ours: it knows
 * nothing of the 30-point threshold on repetition and bikjang, or of the general-capture exception
 * (`docs/bot.md`). So it is never asked an open question. It is handed exactly the moves `legalMovesFor`
 * allows, and a rested turn where `canPass` allows one, and whatever it picks is legal here.
 *
 * A turn that would hand the opponent a bikjang worth calling is taken off that list, unless that
 * leaves nothing — an army that must play something plays the least bad thing, and the engine is the
 * judge of that.
 */
export function candidateTurnsFor(state: GameState, evaluation: number | undefined): readonly BotTurn[] {
  const moves = legalMovesFor(state).map((move): BotTurn => ({kind: "move", move}));
  const every = canPass(state) ? [...moves, PASS] : moves;

  const safe = every.filter(turn => !handsOpponentABikjang(state, turn, evaluation));

  return safe.length > 0 ? safe : every;
}

const PASS: BotTurn = {kind: "pass"};
