import type {StyleOutcome} from "@src/react/pages/game/components/styles-sheet/types/StyleOutcome";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {decodeKey} from "@janggi/shared/janggi/share-keys/DecodeKey";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

/**
 * The style in a key a player has pasted — a board key or a pieces key, told apart by how it opens —
 * checked all the way down, or why it will not be imported. One box takes either, because a player
 * handed a key should not have to know which kind it is.
 */
export function styleImportFrom(text: string): StyleOutcome {
  const board = decodeKey("board", text);
  if (board !== undefined) {
    const checked = boardStyleFrom(board);

    return checked.kind === "accepted" ? {kind: "board", style: checked.value} : checked;
  }

  const pieces = decodeKey("pieces", text);
  if (pieces !== undefined) {
    const checked = pieceSetStyleFrom(pieces);

    return checked.kind === "accepted" ? {kind: "pieces", style: checked.value} : checked;
  }

  return {kind: "refused", reason: "That is not a board or piece set key."};
}
