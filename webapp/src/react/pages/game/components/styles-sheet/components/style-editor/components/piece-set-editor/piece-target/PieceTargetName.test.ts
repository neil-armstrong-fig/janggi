import {expect, it} from "vitest";
import {ENGLISH_MESSAGES} from "@src/language/messages/english/EnglishMessages";
import {pieceTargetName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/PieceTargetName";

it("names an army", () => {
  expect(pieceTargetName({kind: "side", side: "cho"}, ENGLISH_MESSAGES)).toBe("Cho");
});

it("names a piece by its army and what it is", () => {
  expect(pieceTargetName({kind: "piece", piece: {side: "han", type: "general"}}, ENGLISH_MESSAGES)).toBe("Han general");
});
