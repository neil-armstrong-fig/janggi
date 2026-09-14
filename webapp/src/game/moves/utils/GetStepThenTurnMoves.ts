import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Step} from "@src/game/board/types/Step";
import {ORTHOGONAL_STEPS} from "@src/game/moves/utils/OrthogonalSteps";
import {canLandOn} from "@src/game/moves/utils/CanLandOn";
import {pointAfterStep} from "@src/game/moves/utils/PointAfterStep";
import {pieceAt} from "@src/game/board/lookup/PieceAt";

/**
 * The horse's move and the elephant's, which are the same move with a different number: one step
 * along a line, then `turns` steps diagonally, carrying on away from where it started.
 *
 * Neither piece jumps. **Every point on the way is a blocking point** — the elbow the piece steps to
 * first, and for the elephant the diagonal point after it — and a piece of either army standing on
 * one bars that direction entirely. The horse therefore has one blocking point per direction and
 * the elephant two, which is why an elephant is so often stuck.
 *
 * The first step is always along an orthogonal line, never a palace diagonal: the Korea Janggi
 * Association says so twice, once per piece, in the same parenthesis — 단, 궁성의 대각선 제외.
 * See `docs/rules.md` §4.3 and §4.4.
 */
export function getStepThenTurnMoves(
  pieces: PieceLookup,
  from: Position,
  side: Side,
  turns: number,
): readonly Position[] {
  const destinations: Position[] = [];

  for (const step of ORTHOGONAL_STEPS) {
    const elbow = pointAfterStep(from, step);
    if (!elbow || pieceAt(pieces, elbow)) continue;

    for (const diagonal of diagonalsContinuing(step)) {
      const destination = walkThrough(pieces, elbow, diagonal, turns);

      if (destination && canLandOn(pieces, destination, side)) destinations.push(destination);
    }
  }

  return destinations;
}

/**
 * The two diagonals that carry on outward from an orthogonal step: keep the direction it was
 * already travelling in, and fan out by one to either side of it. Turning back would put the piece
 * beside where it started rather than a knight's move from it.
 */
function diagonalsContinuing({fileStep, rankStep}: Step): readonly Step[] {
  if (fileStep === 0) {
    return [
      {fileStep: -1, rankStep},
      {fileStep: 1, rankStep},
    ];
  }

  return [
    {fileStep, rankStep: -1},
    {fileStep, rankStep: 1},
  ];
}

/** Where `turns` steps lead, or nothing if the board runs out or anything is stood in the way. */
function walkThrough(pieces: PieceLookup, from: Position, step: Step, turns: number): Position | undefined {
  let point = from;

  for (let taken = 0; taken < turns; taken += 1) {
    const next = pointAfterStep(point, step);
    if (!next) return undefined;

    // Only the final point may be occupied — landing there is the move, and possibly a capture.
    const isLast = taken === turns - 1;
    if (!isLast && pieceAt(pieces, next)) return undefined;

    point = next;
  }

  return point;
}
