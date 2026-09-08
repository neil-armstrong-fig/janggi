import {getLegalCannonMoves} from "@src/game/moves/GetLegalCannonMoves";
import {getLegalChariotMoves} from "@src/game/moves/GetLegalChariotMoves";
import {getLegalElephantMoves} from "@src/game/moves/GetLegalElephantMoves";
import {getLegalGeneralMoves} from "@src/game/moves/GetLegalGeneralMoves";
import {getLegalGuardMoves} from "@src/game/moves/GetLegalGuardMoves";
import {getLegalHorseMoves} from "@src/game/moves/GetLegalHorseMoves";
import type {GameState} from "@src/game/types/GameState";
import type {Mover} from "@src/game/types/Mover";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Position} from "@src/game/board/types/Position";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {getLegalSoldierMoves} from "@src/game/moves/GetLegalSoldierMoves";

/**
 * Everywhere the piece on one point may go, and nothing at all where no piece stands.
 *
 * It deliberately does **not** care whose turn it is. "Where could this piece go" is the question a
 * board asks in order to light up the points a player may tap, and it is worth answering for either
 * army. Whose turn it is becomes a rule one layer up, in `applyMove`.
 *
 * Nothing here knows about check either, so a move that leaves — or moves into — check is still
 * listed. See `docs/rules.md` §6.1.
 */
export function movesFrom(state: GameState, from: Position): readonly Position[] {
  const pieces = piecesByPosition(state.pieces);

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
