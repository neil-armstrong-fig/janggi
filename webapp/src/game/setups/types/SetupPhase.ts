import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * A game being laid out: which of janggi's two games is about to be played, and what each player has
 * chosen so far — 판차림, the phase before anybody moves. See `docs/rules.md` §6.6 and
 * `docs/opening-setups.md` §4.
 *
 * This sits **beside** `GameState` and never inside it, the way `PlayedGame` does. `GameState`'s bar
 * for a new field is "a rule asked and the board cannot answer", and that bar is not even reached
 * here: there is no board yet. A phase before the game is not a position, so it gets a type of its
 * own and `GameState` is untouched.
 *
 * The two setups are spelled out as `Setup | undefined` rather than left optional. "Has laid out" is
 * the single fact the whole rule turns on, so it is written down rather than inferred from a missing
 * key — and a `place` that dropped one through a spread would still have type-checked.
 */
export interface SetupPhase {
  /**
   * Which game is being laid out. It rides on the phase and then on the state, never threaded as an
   * argument, for the reason `GameState.format` gives — and it is what decides whether the order
   * below is enforced at all.
   */
  readonly format: MatchFormat;

  /** What Han chose, or nothing yet. Han lays out first, and in a scored game only once. */
  readonly hanSetup: Setup | undefined;

  /** What Cho chose, or nothing yet. Cho answers what Han has done, and may keep answering. */
  readonly choSetup: Setup | undefined;
}

/**
 * A phase both players have finished with, so there is a board to deal. `isArranged` is what narrows
 * to it, which is what keeps `newGameFrom` from carrying a second copy of the same question.
 */
export interface ArrangedSetupPhase extends SetupPhase {
  readonly hanSetup: Setup;
  readonly choSetup: Setup;
}
