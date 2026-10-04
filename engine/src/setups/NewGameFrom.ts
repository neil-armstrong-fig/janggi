import type {GameState} from "@janggi/engine/types/GameState";
import type {SetupPhase} from "@janggi/engine/setups/types/SetupPhase";
import {isArranged} from "@janggi/engine/setups/IsArranged";
import {newGame} from "@janggi/engine/NewGame";

/**
 * The game a finished setup phase opens as — the setup-phase route to what `newGame` deals directly,
 * and nothing more. It re-derives nothing: `newGame` is still the one place a starting position is
 * described.
 *
 * **Throws** while either army is still to choose, in the same spirit as everything else here: the
 * caller has just been told by `isArranged`. That one call is also what narrows the two setups from
 * `Setup | undefined`, so the question is asked once rather than restated here.
 */
export function newGameFrom(phase: SetupPhase): GameState {
  if (!isArranged(phase)) throw new Error("A game starts once both armies have laid out, and one of them has not");

  return newGame(phase.hanSetup, phase.choSetup, phase.format);
}
