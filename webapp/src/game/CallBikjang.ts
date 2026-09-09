import type {GameState} from "@src/game/types/GameState";
import {canCallBikjang} from "@src/game/CanCallBikjang";
import {isBikjang} from "@src/game/IsBikjang";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * The game after a bikjang is called: every piece exactly where it stood, nobody's turn taken, and
 * the game stopped.
 *
 * A call rather than an automatic ending, which is the decision `docs/rules.md` §6.2 records. Both
 * readings of the rule describe something a player *does* — "빅장을 부를 수 있다", and pychess's
 * player who chooses not to move away — and making it automatic would end games nobody had agreed
 * to end, in every position two generals happen to see each other.
 *
 * What the call settles is not decided here: `outcomeOf` draws a casual game and hands a scored one
 * to the points, because a scored format has no draw to reach.
 *
 * **Throws** when there is no call to make, exactly as `pass` throws — the caller has just been
 * told by `canCallBikjang`.
 */
export function callBikjang(state: GameState): GameState {
  if (outcomeOf(state).kind !== "undecided") throw new Error("The game is over, so there is nothing left to call");

  if (!isBikjang(state)) throw new Error("The generals are not facing each other, so there is no bikjang to call");

  if (!canCallBikjang(state)) {
    throw new Error("A bikjang may be called under thirty points a side, and not one a general took its way into");
  }

  return {...state, bikjangCalled: true};
}
