import type {File, Rank} from "@src/game/board/types/Position";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** One piece and the point it stands on, as a test spells it out. */
export interface Placement {
  readonly side: Side;
  readonly type: PieceType;
  readonly file: File;
  readonly rank: Rank;
}

/**
 * A piece standing on a point, for a test that builds a position by hand.
 *
 * Every test that hand-builds a board wants this and used to declare its own copy, so it is one helper
 * here rather than thirty identical ones. The coordinates are `File` and `Rank` rather than `number`,
 * so a test that puts a piece off the edge of the board does not compile — which is the whole reason
 * those unions exist, and the copies gave it away by casting.
 */
export function placed({side, type, file, rank}: Placement): PlacedPiece {
  return {piece: {side, type}, position: {file, rank}};
}
