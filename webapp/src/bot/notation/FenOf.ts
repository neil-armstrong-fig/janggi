import {FILES, RANKS} from "@src/game/board/BoardDimensions";
import type {GameState} from "@src/game/types/GameState";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Rank} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";

/**
 * A position written the way Fairy-Stockfish reads a janggi one.
 *
 * Its FEN runs from its tenth rank down to its first, and its first rank is Cho's back edge — so the
 * first row written is **our rank 1**, Han's edge, exactly the order `RANKS` already runs in. Cho is
 * white and upper case, and moves first; Han is black and lower case.
 *
 * Only the board and the side to move. The rest of what the engine would take from a FEN — castling,
 * en passant, the move clocks — janggi has no use for, and the history repetition needs travels as
 * the moves after the position instead.
 */
export function fenOf(state: GameState): string {
  const pieces = piecesByPosition(state.pieces);
  const rows = RANKS.map(rank => rowOf(pieces, rank));

  return `${rows.join("/")} ${SIDE_LETTERS[state.sideToMove]} - - 0 1`;
}

function rowOf(pieces: PieceLookup, rank: Rank): string {
  let row = "";
  let empty = 0;

  for (const file of FILES) {
    const piece = pieceAt(pieces, {file, rank});

    if (!piece) {
      empty += 1;
      continue;
    }

    if (empty > 0) row += String(empty);
    empty = 0;
    row += letterOf(piece);
  }

  return empty > 0 ? `${row}${empty}` : row;
}

function letterOf(piece: Piece): string {
  const letter = PIECE_LETTERS[piece.type];

  return piece.side === "cho" ? letter.toUpperCase() : letter;
}

/** Fairy-Stockfish's own letters for its janggi pieces: the guard is its wazir, the elephant its `b`. */
const PIECE_LETTERS: Record<PieceType, string> = {
  general: "k",
  guard: "a",
  horse: "n",
  elephant: "b",
  chariot: "r",
  cannon: "c",
  soldier: "p",
};

const SIDE_LETTERS: Record<Side, string> = {cho: "w", han: "b"};
