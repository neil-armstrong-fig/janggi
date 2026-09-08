import type {Line} from "@src/game/moves/types/Line";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {linesFrom} from "@src/game/moves/utils/LinesFrom";
import {pieceAt} from "@src/game/board/utils/PieceAt";

/**
 * Where a cannon (포) may go. The awkward piece, with four rules no other piece has:
 *
 * 1. It travels the same lines as the chariot but **must jump exactly one piece**, the screen.
 *    With nothing to jump it cannot move at all — unlike xiangqi, where a cannon slides freely and
 *    only needs a screen to capture.
 * 2. The screen may belong to either army, but **may never be a cannon**.
 * 3. **It may not capture a cannon.**
 * 4. It moves and captures identically: past the screen, onto any empty point, or onto the first
 *    piece beyond if that is an enemy and not a cannon.
 *
 * Inside a palace the same applies along the drawn diagonal, which in practice means corner to
 * corner over whatever stands on the centre — the centre being the only point between two opposite
 * corners. See `docs/rules.md` §4.6.
 */
export function getLegalCannonMoves(pieces: PieceLookup, from: Position, side: Side): readonly Position[] {
  return linesFrom(from).flatMap(line => shotsAlong(pieces, line, side));
}

function shotsAlong(pieces: PieceLookup, line: Line, side: Side): Position[] {
  const destinations: Position[] = [];

  for (const point of beyondTheScreen(pieces, line)) {
    const occupant = pieceAt(pieces, point);

    if (!occupant) {
      destinations.push(point);
      continue;
    }

    if (occupant.side !== side && occupant.type !== "cannon") destinations.push(point);
    break;
  }

  return destinations;
}

/**
 * The stretch of line past the screen, which is where a cannon's move begins. Empty when the line
 * holds nothing to jump, and empty when the first thing on it is a cannon — a cannon met first
 * blocks the line outright, since it can be neither jumped nor jumped over.
 */
function beyondTheScreen(pieces: PieceLookup, line: Line): Line {
  for (const [index, point] of line.entries()) {
    const occupant = pieceAt(pieces, point);
    if (!occupant) continue;

    return occupant.type === "cannon" ? [] : line.slice(index + 1);
  }

  return [];
}
