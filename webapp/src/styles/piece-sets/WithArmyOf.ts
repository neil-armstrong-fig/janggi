import type {PieceOverrides, PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";

/**
 * The set with one army drawn as another set draws it: that army's style, and every piece of it the source
 * gives a style of its own. The other army, the set's name and how it is handled are the set's own.
 */
export function withArmyOf(
  pieceSetStyle: PieceSetStyle,
  sourcePieceSetStyle: PieceSetStyle,
  side: Side,
): PieceSetStyle {
  const kept = Object.entries(pieceSetStyle.pieces ?? {}).filter(([key]) => parsePieceKey(key)?.side !== side);
  const taken = Object.entries(sourcePieceSetStyle.pieces ?? {}).filter(([key]) => parsePieceKey(key)?.side === side);
  const pieceOverrides: PieceOverrides = Object.fromEntries([...kept, ...taken]);
  const {pieces: _, ...withoutPieces} = pieceSetStyle;

  return {
    ...withoutPieces,
    sides: {...pieceSetStyle.sides, [side]: sourcePieceSetStyle.sides[side]},
    ...(Object.keys(pieceOverrides).length === 0 ? {} : {pieces: pieceOverrides}),
  };
}
