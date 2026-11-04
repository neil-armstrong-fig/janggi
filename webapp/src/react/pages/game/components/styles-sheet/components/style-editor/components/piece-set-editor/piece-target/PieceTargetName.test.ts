import {expect, it} from "vitest";
import {ENGLISH} from "@src/language/english/English";
import {pieceTargetName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/PieceTargetName";

it("names an army", () => {
  expect(pieceTargetName({kind: "side", side: "cho"}, ENGLISH)).toBe("Cho");
});

it("names a piece by its army and what it is", () => {
  expect(pieceTargetName({kind: "piece", piece: {side: "han", type: "general"}}, ENGLISH)).toBe("Han general");
});
