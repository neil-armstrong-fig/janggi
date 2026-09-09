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
 * What is *not* here is as deliberate. There is no move history, no captured pile and no result.
 * Material is summed off the board — every setup deals the same sixteen pieces, so what is missing
 * is what was taken — and a result is a fact about the position rather than a second thing to keep
 * in step with it, which is why `outcomeOf` derives one. The position history repetition needs is
 * still absent, because repetition is not modelled; see `docs/rules.md` §6.4.
 */
export interface GameState {
  readonly pieces: readonly PlacedPiece[];
  readonly sideToMove: Side;

  /**
   * How many turns in a row have been rested rather than played. Any move puts it back to nought,
   * and the second in a row ends the game on points — 대한장기연맹's 2022 revision, `docs/rules.md`
   * §6.3. It is the one piece of history the rules ask for, and it is here rather than derived
   * because a pass leaves no trace on the board to derive it from.
   */
  readonly consecutivePasses: number;
}
