import type {GameState} from "@src/game/types/GameState";
import type {Standing} from "@src/game/types/Standing";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * What another position would have to match for the game to have come round to this one: every
 * piece on its point, and whose turn it is.
 *
 * **Sorted**, because the order of `pieces` is meaningless and does not survive a move —
 * `positionAfter` puts the piece that moved at the end of the list, so two identical boards reached
 * by different routes would otherwise never compare equal.
 *
 * The side to move is part of it: the same board with the other army to play is a different
 * position offering a different game. Nothing else is. The format cannot vary within a game, and
 * the pass count cannot reach two without the game ending, so neither can tell two standings apart.
 */
export function standingOf({pieces, sideToMove}: GameState): Standing {
  const placements = pieces.map(({piece, position}) => `${toPieceKey(piece)}@${toPositionKey(position)}`);

  return `${placements.sort().join(",")}:${sideToMove}`;
}
