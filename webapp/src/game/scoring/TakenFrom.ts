import type {GameState} from "@src/game/types/GameState";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Every piece that army has lost, one entry per piece, in the order pieces are named — the general
 * first, the soldiers last.
 *
 * Read off the board for the reason `materialFor` is: every setup deals the same sixteen, so what an
 * army is missing is exactly what was taken from it, and a captured pile kept beside the position
 * would be a second copy of that to keep in step. A setup only rearranges the back rank; it never
 * changes how many of anything there are.
 *
 * An army holding more of a kind than it was dealt — which only a hand-built position can — has lost
 * none of that kind, rather than a negative number of them.
 */
export function takenFrom(state: GameState, side: Side): readonly PieceType[] {
  const standing = state.pieces.filter(({piece}) => piece.side === side);

  return PIECE_TYPES.flatMap(type => {
    const left = standing.filter(({piece}) => piece.type === type).length;

    return Array<PieceType>(Math.max(0, DEALT[type] - left)).fill(type);
  });
}

/** The sixteen an army opens with, whichever arrangement it chose. `TakenFrom.test.ts` checks it against every setup. */
const DEALT: Record<PieceType, number> = {
  general: 1,
  guard: 2,
  horse: 2,
  elephant: 2,
  chariot: 2,
  cannon: 2,
  soldier: 5,
};
