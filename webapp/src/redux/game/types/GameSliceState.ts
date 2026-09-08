import type {GameState} from "@src/game/types/GameState";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * The game being played, and the two arrangements it was dealt from.
 *
 * The setups live here rather than beside the board style because they are not a preference — they
 * decide the starting position, so they are part of the game.
 *
 * `movesPlayed` is counted but **not yet read by anything**. It is meant to lock the setups — a
 * back rank is arranged strictly before play — and until something enforces that, choosing a setup
 * mid-game silently re-deals the board and hands the turn back to cho. See `todo.txt`.
 *
 * What is *not* here is which point a player has tapped. That is UI state, it belongs to the
 * component that draws the board, and putting it in the store would make every highlight a
 * dispatch.
 */
export interface GameSliceState {
  readonly game: GameState;
  readonly hanSetup: Setup;
  readonly choSetup: Setup;
  readonly movesPlayed: number;
}
