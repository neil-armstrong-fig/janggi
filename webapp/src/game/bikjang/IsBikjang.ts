import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {RANKS} from "@src/game/board/BoardDimensions";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";

/**
 * 빅장 — whether the two generals stand facing each other down a file with nothing in between.
 *
 * The position alone, and nothing about whether anyone may do anything about it: a bikjang is
 * *called*, so `canCallBikjang` is where the format, the thirty-point threshold and the
 * general-capture exception live. See `docs/rules.md` §6.2.
 *
 * Neither general can leave its own palace, so the file the two share is always 4, 5 or 6 — but
 * that falls out rather than being tested for, and a hand-built position with a general elsewhere
 * is answered on what it actually shows.
 */
export function isBikjang(state: GameState): boolean {
  const cho = generalOf(state, "cho");
  const han = generalOf(state, "han");
  if (!cho || !han) return false;

  return cho.file === han.file && nothingBetween(state, cho, han);
}

function generalOf(state: GameState, side: Side): Position | undefined {
  return state.pieces.find(({piece}) => piece.side === side && piece.type === "general")?.position;
}

/** Whether the file the two generals share is clear between them. Both stand on it, so either gives the file. */
function nothingBetween(state: GameState, from: Position, to: Position): boolean {
  const pieces = piecesByPosition(state.pieces);
  const lower = Math.min(from.rank, to.rank);
  const upper = Math.max(from.rank, to.rank);

  return RANKS.filter(rank => rank > lower && rank < upper).every(rank => !pieceAt(pieces, {file: from.file, rank}));
}
