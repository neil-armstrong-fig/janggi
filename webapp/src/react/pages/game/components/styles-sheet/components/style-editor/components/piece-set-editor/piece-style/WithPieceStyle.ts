import type {PieceOverrides, PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import {pieceStyleAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/PieceStyleAt";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/**
 * The set with what is being changed changed by `update`.
 *
 * An army is all of its pieces: what it wears by default, and every piece of it that has a style of its own,
 * which every built-in set gives its general. Changing the writing on an army that left the general as it
 * was would leave the army half changed. A single piece is changed alone, and one that had no style of its
 * own is given one, made from what it wore, so changing one thing leaves the rest as it was.
 */
export function withPieceStyle(
  pieceSetStyle: PieceSetStyle,
  pieceTarget: PieceTarget,
  update: (pieceStyle: PieceStyle) => PieceStyle,
): PieceSetStyle {
  if (pieceTarget.kind === "piece") {
    return {
      ...pieceSetStyle,
      pieces: {
        ...pieceSetStyle.pieces,
        [toPieceKey(pieceTarget.piece)]: update(pieceStyleAt(pieceSetStyle, pieceTarget)),
      },
    };
  }

  const {side} = pieceTarget;
  const pieceOverrides: PieceOverrides | undefined =
    pieceSetStyle.pieces &&
    Object.fromEntries(
      Object.entries(pieceSetStyle.pieces).map(([key, piece]) => [
        key,
        parsePieceKey(key)?.side === side ? update(piece) : piece,
      ]),
    );

  return {
    ...pieceSetStyle,
    sides: {...pieceSetStyle.sides, [side]: update(pieceSetStyle.sides[side])},
    ...(pieceOverrides === undefined ? {} : {pieces: pieceOverrides}),
  };
}
