import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What one army still has on the board, counted in points.
 *
 * Summed off the board rather than kept as a running total, because every setup deals the same
 * sixteen pieces — so what an army is missing is exactly what has been taken from it, and there is
 * nothing for a captured pile to tell you that the board does not.
 *
 * This is the piece score alone, with no 덤 in it. That is the number bikjang's thirty-point
 * threshold is measured against; `scoreFor` is the one a game is won on. See `docs/rules.md` §6.5.
 */
export function materialFor(state: GameState, side: Side): number {
  return state.pieces
    .filter(({piece}) => piece.side === side)
    .reduce((total, {piece}) => total + PIECE_VALUES[piece.type], 0);
}

/**
 * 대한장기협회's 대국규정, quoted in `docs/rules.md` §6.5. The sixteen pieces an army opens with come
 * to seventy-two.
 *
 * The general is worth nothing, and not because it is worthless: a game in which it can be taken is
 * already over, so its value never enters a count.
 */
const PIECE_VALUES: Record<PieceType, number> = {
  general: 0,
  guard: 3,
  horse: 5,
  elephant: 3,
  chariot: 13,
  cannon: 7,
  soldier: 2,
};
