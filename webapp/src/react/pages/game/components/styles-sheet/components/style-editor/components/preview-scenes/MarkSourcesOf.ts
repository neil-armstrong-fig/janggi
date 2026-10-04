import type {MarkSources} from "@src/react/pages/game/components/board/components/intersections/cell-marks/types/MarkSources";
import type {Position, PositionKey} from "@janggi/engine/board/types/Position";
import type {PreviewScene} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/PreviewScene";
import {coveredFrom} from "@janggi/engine/moves/CoveredFrom";
import {movablePieces} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/MovablePieces";
import {movesFrom} from "@janggi/engine/MovesFrom";
import {piecesByPosition} from "@janggi/engine/board/lookup/PiecesByPosition";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/**
 * What the marks of a scene are worked out from, asked of the engine as the board in play asks it: where
 * the piece in hand may go, which pieces may move, and where the check is.
 */
export function markSourcesOf({game, held, lastMove, threat}: PreviewScene): MarkSources {
  return {
    pieces: piecesByPosition(game.pieces),
    heldKey: held && toPositionKey(held),
    reachable: keysOf(held ? movesFrom(game, held) : []),
    covered: keysOf(held ? coveredFrom(game, held) : []),
    movable: movablePieces(game, true),
    lastMove,
    threatenedKey: threat && toPositionKey(threat.general),
    attackerKeys: keysOf(threat?.attackers ?? []),
    // The preview shows no opponent to leave a bikjang hint against.
    bikjangRiskKeys: NO_POSITIONS,
  };
}

const NO_POSITIONS: ReadonlySet<PositionKey> = new Set();

function keysOf(positions: readonly Position[]): ReadonlySet<PositionKey> {
  return new Set(positions.map(toPositionKey));
}
