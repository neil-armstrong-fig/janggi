import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {pieceStyleAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/PieceStyleAt";

it("is what an army wears, for the army", () => {
  expect(pieceStyleAt(hangulPieces, {kind: "side", side: "han"})).toBe(hangulPieces.sides.han);
});

it("is a piece's own style where it has one, and what its army wears otherwise", () => {
  expect(pieceStyleAt(hangulPieces, {kind: "piece", piece: {side: "cho", type: "general"}})).toBe(
    hangulPieces.pieces?.["cho-general"],
  );
  expect(pieceStyleAt(hangulPieces, {kind: "piece", piece: {side: "cho", type: "chariot"}})).toBe(
    hangulPieces.sides.cho,
  );
});
