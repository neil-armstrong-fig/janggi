import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {isPieceOverridden} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/IsPieceOverridden";

it("is true of a piece with a style of its own", () => {
  expect(isPieceOverridden(hangulPieces, {kind: "piece", piece: {side: "cho", type: "general"}})).toBe(true);
});

it("is false of a piece without one, and of a whole army", () => {
  expect(isPieceOverridden(hangulPieces, {kind: "piece", piece: {side: "cho", type: "chariot"}})).toBe(false);
  expect(isPieceOverridden(hangulPieces, {kind: "side", side: "cho"})).toBe(false);
});
