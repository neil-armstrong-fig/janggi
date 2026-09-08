import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {ORTHOGONAL_STEPS} from "@src/game/moves/utils/OrthogonalSteps";
import {canLandOn} from "@src/game/moves/utils/CanLandOn";
import {isInPalace} from "@src/game/board/utils/Palaces";
import {pointAfterStep} from "@src/game/moves/utils/PointAfterStep";
import {palaceDiagonalStepsAt} from "@src/game/board/utils/PalaceDiagonals";

/**
 * One step along a drawn line, and never outside the army's own palace. The whole of how both the
 * general and its guards move — the Korea Janggi Association states the guard's rule as one
 * sentence, "사의 행마법은 궁과 동일하다", the guard moves exactly as the general does.
 *
 * The palace is what makes this more than a king's move: only five of its nine points have a
 * diagonal drawn at them, so the centre offers eight destinations, a corner three and the middle of
 * an edge three. Asking `palaceDiagonalStepsAt` for the diagonals rather than assuming four is what
 * gets that right. See `docs/rules.md` §4.1.
 */
export function getPalaceStepMoves(pieces: PieceLookup, from: Position, side: Side): readonly Position[] {
  const steps = [...ORTHOGONAL_STEPS, ...palaceDiagonalStepsAt(from)];

  return steps
    .map(step => pointAfterStep(from, step))
    .filter(to => to !== undefined)
    .filter(to => isInPalace(to, side) && canLandOn(pieces, to, side));
}
