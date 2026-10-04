import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {OpponentLook} from "@src/redux/online/types/OpponentLook";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {decodeKey} from "@janggi/shared/janggi/share-keys/DecodeKey";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

/**
 * The friend's introduction as what this player may draw with. The name is as the room cleaned it; each key is decoded and
 * checked all the way down, like one pasted into the styles sheet, and a key that fails is the same as none: that part of
 * the look stays the player's own.
 */
export function opponentLookFrom({displayName, boardKey, piecesKey}: Introduction): OpponentLook {
  const board = boardKey === undefined ? undefined : boardStyleFrom(decodeKey("board", boardKey));
  const pieces = piecesKey === undefined ? undefined : pieceSetStyleFrom(decodeKey("pieces", piecesKey));

  return {
    displayName,
    ...(board?.kind === "accepted" ? {boardStyle: board.value} : {}),
    ...(pieces?.kind === "accepted" ? {pieceSet: pieces.value} : {}),
  };
}
