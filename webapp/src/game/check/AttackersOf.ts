import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {reaches} from "@src/game/check/utils/Reaches";

/**
 * Where every enemy piece giving check to that army's general stands — nothing, one, or two where a
 * move uncovered a second line.
 *
 * `isInCheck` is the question and stays the one the rules ask, because it stops at the first
 * attacker and this cannot. This is for a board that wants to *show* the check: drawing the line
 * from the pieces this names means a line on screen is always an attack the rules agree with.
 *
 * An army with no general is attacked by nothing, as `isInCheck` says.
 */
export function attackersOf(state: GameState, side: Side): readonly Position[] {
  const general = state.pieces.find(({piece}) => piece.side === side && piece.type === "general");
  if (!general) return NOBODY;

  const pieces = piecesByPosition(state.pieces);

  return state.pieces
    .filter(({piece, position}) => piece.side !== side && reaches(pieces, position, general.position))
    .map(({position}) => position);
}

const NOBODY: readonly Position[] = [];
