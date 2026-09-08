import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {getStepThenTurnMoves} from "@src/game/moves/utils/GetStepThenTurnMoves";

/**
 * Where an elephant (상) may go: one step along a line, then **two** diagonal steps carrying on
 * outward — the far corner of a 2x3 rectangle.
 *
 * This is not the xiangqi elephant. It is much longer-ranged, and with no river on the board it
 * crosses to the enemy half as freely as anything else. The price is a second blocking point: two
 * intervening points instead of the horse's one, either of which stops it.
 * See `docs/rules.md` §4.4.
 */
export function getLegalElephantMoves(pieces: PieceLookup, from: Position, side: Side): readonly Position[] {
  return getStepThenTurnMoves(pieces, from, side, DIAGONAL_STEPS_AFTER_THE_TURN);
}

const DIAGONAL_STEPS_AFTER_THE_TURN = 2;
