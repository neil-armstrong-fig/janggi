import type {PlacedPiece} from "@src/react/pages/game/components/board/types/PlacedPiece";
import {expect, it} from "vitest";
import {piecesByPosition} from "@src/react/pages/game/components/board/utils/PiecesByPosition";

const chariot: PlacedPiece = {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}};
const general: PlacedPiece = {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}};

it("indexes each piece under the intersection it stands on", () => {
  expect(piecesByPosition([chariot, general]).get("f5r2")).toEqual(general.piece);
});

it("indexes every piece it is given", () => {
  expect(piecesByPosition([chariot, general]).size).toBe(2);
});

it("indexes nothing when handed no pieces", () => {
  expect(piecesByPosition([]).size).toBe(0);
});
