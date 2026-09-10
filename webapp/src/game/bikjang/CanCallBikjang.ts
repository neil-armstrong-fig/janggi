import type {GameState} from "@src/game/types/GameState";
import {isBikjang} from "@src/game/bikjang/IsBikjang";
import {outcomeOf} from "@src/game/OutcomeOf";
import {underThirtyPointsEach} from "@src/game/utils/UnderThirtyPointsEach";

/**
 * Whether the bikjang on the board may be called, which is the whole of where the two match formats
 * part company. See `docs/rules.md` §6.2.
 *
 * **Casual** — the generals facing each other is the whole of it. That is en.wikipedia's and
 * pychess's reading, and the game every online implementation plays.
 *
 * **Scored** — the KJA's 대국규정 adds two conditions, and both are quoted in the rules doc: each
 * side under thirty points, and not a bikjang the general took its way into. The exception lasts
 * exactly one ply, because `reachedByAGeneralCapture` does.
 *
 * This stands to `callBikjang` as `canPass` stands to `pass` — the question a board asks in order to
 * offer the call, where `callBikjang` is the call being made.
 */
export function canCallBikjang(state: GameState): boolean {
  if (outcomeOf(state).kind !== "undecided") return false;

  if (!isBikjang(state)) return false;

  if (state.format === "Casual") return true;

  return underThirtyPointsEach(state) && !state.reachedByAGeneralCapture;
}
