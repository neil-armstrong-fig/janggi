import {getLegalCannonMoves} from "@src/game/moves/GetLegalCannonMoves";
import {getLegalChariotMoves} from "@src/game/moves/GetLegalChariotMoves";
import {getLegalElephantMoves} from "@src/game/moves/GetLegalElephantMoves";
import {getLegalGeneralMoves} from "@src/game/moves/GetLegalGeneralMoves";
import {getLegalGuardMoves} from "@src/game/moves/GetLegalGuardMoves";
import {getLegalHorseMoves} from "@src/game/moves/GetLegalHorseMoves";
import type {Mover} from "@src/game/moves/types/Mover";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Position} from "@src/game/board/types/Position";
import {getLegalSoldierMoves} from "@src/game/moves/GetLegalSoldierMoves";
import {pieceAt} from "@src/game/board/utils/PieceAt";

/**
 * Where the piece on one point may go **by its own movement rules alone**, ignoring what that would
 * do to its own general.
 *
 * This is what a piece attacks, which is why check is computed from it: a piece pinned against its
 * own general still gives check, so the question "is this point attacked" must not itself be
 * filtered by check. `movesFrom` is this, minus anything that leaves its own general in danger.
 *
 * It takes an **already-indexed board** rather than a `GameState`, and that is the difference that
 * keeps a check filter affordable: testing one candidate move asks all sixteen enemy pieces where
 * they can reach, and indexing the board once for the lot rather than once each is most of the
 * cost. Passing the index is not storing it.
 */
export function pseudoLegalMovesFrom(pieces: PieceLookup, from: Position): readonly Position[] {
  const moving = pieceAt(pieces, from);
  if (!moving) return [];

  return MOVERS[moving.type](pieces, from, moving.side);
}

/**
 * One generator per kind of piece. Typed as a full `Record`, so adding a piece type to the shared
 * `PIECE_TYPES` list without teaching it to move is a compile error rather than a lookup that
 * quietly returns undefined mid-game.
 */
const MOVERS: Record<PieceType, Mover> = {
  general: getLegalGeneralMoves,
  guard: getLegalGuardMoves,
  horse: getLegalHorseMoves,
  elephant: getLegalElephantMoves,
  chariot: getLegalChariotMoves,
  cannon: getLegalCannonMoves,
  soldier: getLegalSoldierMoves,
};
