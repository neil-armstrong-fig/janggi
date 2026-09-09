import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * The game being played, and the two arrangements it was dealt from.
 *
 * The setups live here rather than beside the board style because they are not a preference — they
 * decide the starting position, so they are part of the game.
 *
 * `played` is the whole record rather than a bare `GameState`, so the store holds where the game has
 * been as well as where it is. Everything that reads a position reads `played.present`.
 *
 * There is no `turnsTaken` any more, and its absence is the point. It used to count the turns in
 * order to lock the setup pickers, and it only ever climbed — which was right while a game could
 * only go forwards and became wrong the moment one could be taken back, since a board returned to
 * its starting position would have sat there with the arrangement that produced it still out of
 * reach. `played.past.length` is the same number, derived from the record and falling as the game is
 * taken back, so `playHasBegun` reads it where it is shown instead.
 *
 * What is *not* here is which point a player has tapped. That is UI state, it belongs to the
 * component that draws the board, and putting it in the store would make every highlight a
 * dispatch.
 */
export interface GameSliceState {
  readonly played: PlayedGame;
  readonly hanSetup: Setup;
  readonly choSetup: Setup;
}
