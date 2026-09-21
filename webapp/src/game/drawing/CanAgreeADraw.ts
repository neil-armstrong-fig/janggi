import type {GameState} from "@src/game/types/GameState";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Whether the players may agree to stop the game as a draw — 합의 무승부. See `docs/rules.md` §6.4.
 *
 * **Casual only.** "친선으로 둘 때는 … 반복수가 반복되면 합의하에 무승부가 된다" — friendly play draws
 * by agreement, and a tournament does not: 점수제 has no draw, and two players who wish to stop it
 * already have two rested turns in a row, which count the points. A scored game has nothing to agree.
 *
 * Any position in a casual game will do, and a check is no bar: unlike a pass, an agreement does not
 * leave a general sitting in check, it stops the game. What makes it an agreement rather than a
 * unilateral stop is the answer to the offer, which is the page's to ask — the engine is asked only
 * when both have said yes.
 *
 * This stands to `agreeADraw` as `canPass` stands to `pass` — the question a board asks in order to
 * offer the control, where `agreeADraw` is the draw being made.
 */
export function canAgreeADraw(state: GameState): boolean {
  return state.format === "Casual" && outcomeOf(state).kind === "undecided";
}
