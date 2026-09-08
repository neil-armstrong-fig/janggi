import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {getStepThenTurnMoves} from "@src/game/moves/utils/GetStepThenTurnMoves";

/**
 * Where a horse (마) may go: one step along a line, then one diagonal step carrying on outward.
 * The chess knight's eight destinations — but it does not jump, and a single piece standing on the
 * point it steps to first bars that whole direction. See `docs/rules.md` §4.3.
 */
export function getLegalHorseMoves(pieces: PieceLookup, from: Position, side: Side): readonly Position[] {
  return getStepThenTurnMoves(pieces, from, side, DIAGONAL_STEPS_AFTER_THE_TURN);
}

const DIAGONAL_STEPS_AFTER_THE_TURN = 1;
