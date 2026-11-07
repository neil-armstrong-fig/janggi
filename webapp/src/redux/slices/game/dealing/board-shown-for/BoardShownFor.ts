import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import type {GameState} from "@janggi/engine/types/GameState";
import type {SetupPhase} from "@janggi/engine/setups/types/SetupPhase";
import {isArranged} from "@janggi/engine/setups/IsArranged";
import {newGame} from "@janggi/engine/NewGame";
import {newGameFrom} from "@janggi/engine/setups/NewGameFrom";

/**
 * The position to draw for a phase, finished or not.
 *
 * Once both armies have chosen this is simply `newGameFrom` — the game the phase produced, and the
 * one that is actually played. While a scored game is still being laid out there is no game yet,
 * and the board still has to show something, so the army that has not chosen is drawn on the common
 * arrangement until it does. Han's own choice appears the moment it is made, which is what makes the
 * board the laying-out rather than a picture of one.
 *
 * **This is the only place a default stands in for a choice, and it is a display decision.** The
 * rule's input is the phase, where an army that has not chosen is `undefined` and stays that way;
 * what gets painted while it decides is the store's business. `SetupPhaseFor.ts` draws that line and
 * this is the other side of it.
 */
export function boardShownFor(phase: SetupPhase): GameState {
  if (isArranged(phase)) return newGameFrom(phase);

  return newGame(phase.hanSetup ?? DEFAULT_SETUP, phase.choSetup ?? DEFAULT_SETUP, phase.format);
}
