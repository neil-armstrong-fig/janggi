import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * A game, in full: what stands where, and whose turn it is. Everything the rules need in order to
 * say what may happen next.
 *
 * A flat list rather than a `Map` for three reasons: it is already what `startingPieces` produces
 * and what the board takes, so nothing has to adapt at either end; it survives `JSON.stringify`,
 * which keeps the door open to a Redux slice, persistence and time travel; and with 32 pieces the
 * cost is imaginary — `movesFrom` indexes it once per call and the rules never scan it.
 *
 * What is *not* here is as deliberate. There is no move history, no captured pile and no result,
 * because nothing yet needs them: repetition, scoring and checkmate are recorded in `docs/rules.md`
 * §6 and are not modelled. Adding a field before a rule needs it fixes its shape too early.
 */
export interface GameState {
  readonly pieces: readonly PlacedPiece[];
  readonly sideToMove: Side;
}
