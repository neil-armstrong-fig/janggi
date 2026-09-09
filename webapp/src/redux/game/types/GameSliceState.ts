import type {GameState} from "@src/game/types/GameState";
import type {Setup} from "@src/game/setups/types/Setup";

/**
 * The game being played, and the two arrangements it was dealt from.
 *
 * The setups live here rather than beside the board style because they are not a preference — they
 * decide the starting position, so they are part of the game.
 *
 * `turnsTaken` is what locks the setups: a back rank is arranged strictly before play, so once a
 * turn has been taken neither picker may be used. `GamePage` disables them on it, and `restarted`
 * puts it back to zero — which is the only way back to them.
 *
 * It counts *turns* rather than moves because a rested turn is one too: 한수쉼 is not a move, but
 * play has plainly begun once one has been taken. It is not `game.consecutivePasses` under another
 * name — that one goes back to nought on every move, and this one only ever climbs.
 *
 * What is *not* here is which point a player has tapped. That is UI state, it belongs to the
 * component that draws the board, and putting it in the store would make every highlight a
 * dispatch.
 */
export interface GameSliceState {
  readonly game: GameState;
  readonly hanSetup: Setup;
  readonly choSetup: Setup;
  readonly turnsTaken: number;
}
