import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Standing} from "@src/game/types/Standing";

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
 * in step with it, which is why `outcomeOf` derives one.
 *
 * The four fields below the board are the ones a rule asked for, and each is here for the same
 * reason `consecutivePasses` is: **it cannot be read off the board.** A rested turn, a call, and the
 * fact that the general was the piece that took leave no mark on the pieces, and which of janggi's
 * two match formats is being played is not a fact about the position at all. That is the bar —
 * a field arrives when a rule asks and the board cannot answer, and not before.
 */
export interface GameState {
  readonly pieces: readonly PlacedPiece[];
  readonly sideToMove: Side;

  /**
   * Which of the two games is being played — casual or the KJA's scored tournament format. It gates
   * when a bikjang may be called and whether one draws or settles on points, `docs/rules.md` §6.2.
   *
   * Dealt with the setups rather than threaded through the rules: it cannot change mid-game any
   * more than a back rank can, so `newGame` takes it and `dealtGame` is the one route to a new one.
   */
  readonly format: MatchFormat;

  /**
   * How many turns in a row have been rested rather than played. Any move puts it back to nought,
   * and the second in a row ends the game on points — 대한장기연맹's 2022 revision, `docs/rules.md`
   * §6.3. It is the one piece of history the rules ask for, and it is here rather than derived
   * because a pass leaves no trace on the board to derive it from.
   */
  readonly consecutivePasses: number;

  /**
   * Every position the game has **left behind** since the last capture, which is what repetition is
   * measured against — `docs/rules.md` §6.4. The one the game stands in is not in it: it is
   * `standingOf(state)`, and keeping it out is what lets `positionAfter` build the next state
   * without needing that state's own identity while assembling it.
   *
   * A capture empties it, and loses nothing by doing so: a capture cannot be undone by playing on,
   * so no position from before one can ever come round again. That is what keeps this a handful of
   * entries rather than the whole game.
   */
  readonly seen: readonly Standing[];

  /**
   * Whether the move that reached this position was a general taking a piece — "단, 궁으로 상대
   * 기물 취하면서 빅장이 되는 경우는 예외로 한다", the one exception on a called bikjang,
   * `docs/rules.md` §6.2.
   *
   * A fact about the transition rather than the board, so it lasts exactly one ply, the way any
   * move puts `consecutivePasses` back to nought.
   */
  readonly reachedByAGeneralCapture: boolean;

  /**
   * Whether the players have stopped the game by calling a bikjang. A call moves nothing, so like a
   * rested turn it leaves nothing on the board for `outcomeOf` to read it off.
   *
   * It is not a result — what the call *settles* is still derived, and differs by format: a draw in
   * a casual game, 점수승 in a scored one.
   */
  readonly bikjangCalled: boolean;
}
