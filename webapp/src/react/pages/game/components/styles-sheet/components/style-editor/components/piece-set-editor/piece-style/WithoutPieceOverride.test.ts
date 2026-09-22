import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {withoutPieceOverride} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/WithoutPieceOverride";

it("takes back a piece's own style, leaving the others", () => {
  const changedPieceSetStyle = withoutPieceOverride(hangulPieces, {side: "cho", type: "general"});

  expect(changedPieceSetStyle.pieces).toEqual({"han-general": hangulPieces.pieces?.["han-general"]});
});

it("leaves no empty list of overrides behind when it was the only one", () => {
  const set = {...hangulPieces, pieces: {"cho-general": hangulPieces.sides.cho}};

  expect(withoutPieceOverride(set, {side: "cho", type: "general"})).not.toHaveProperty("pieces");
});

it("leaves a set as it is when the piece had no style of its own", () => {
  expect(withoutPieceOverride(hangulPieces, {side: "cho", type: "chariot"}).pieces).toEqual(hangulPieces.pieces);
  expect(
    withoutPieceOverride({...hangulPieces, pieces: undefined}, {side: "cho", type: "chariot"}).pieces,
  ).toBeUndefined();
});
