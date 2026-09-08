import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What a piece is called out loud — the label a screen reader reads, and the only text on the board
 * that does not depend on which set is being worn. A drawing and a character are two ways of
 * marking the same piece, so both answer to this same name.
 */
export function pieceName({side, type}: Piece): string {
  return `${SIDE_NAMES[side]} ${type}`;
}

const SIDE_NAMES: Record<Side, string> = {han: "Han", cho: "Cho"};
