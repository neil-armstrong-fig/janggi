import type {Line} from "@src/game/moves/types/Line";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {linesFrom} from "@src/game/moves/utils/LinesFrom";
import {pieceAt} from "@src/game/board/utils/PieceAt";

/**
 * Where a chariot (차) may go: as far as it likes along a line, in one direction, until something
 * stops it. The strongest piece on the board, and worth 13 of an army's 72 points.
 *
 * Inside a palace it may also run the drawn diagonal — corner to centre, centre to corner, or
 * corner straight through an empty centre to the far corner — and it may use **either** palace,
 * including one it has invaded. See `docs/rules.md` §4.5.
 */
export function getLegalChariotMoves(pieces: PieceLookup, from: Position, side: Side): readonly Position[] {
  return linesFrom(from).flatMap(line => slideAlong(pieces, line, side));
}

/**
 * How far down one line the chariot gets: every empty point, then the first occupied one if the
 * enemy is standing on it, and nothing at all beyond that. A piece of its own army stops it a point
 * short.
 */
function slideAlong(pieces: PieceLookup, line: Line, side: Side): Position[] {
  const reached: Position[] = [];

  for (const point of line) {
    const occupant = pieceAt(pieces, point);

    if (!occupant) {
      reached.push(point);
      continue;
    }

    if (occupant.side !== side) reached.push(point);
    break;
  }

  return reached;
}
