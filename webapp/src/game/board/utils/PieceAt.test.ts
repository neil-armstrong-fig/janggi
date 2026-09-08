import {expect, it} from "vitest";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";

const pieces = piecesByPosition([
  {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
  {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
]);

it("finds the piece standing on an intersection", () => {
  expect(pieceAt(pieces, {file: 5, rank: 2})).toEqual({side: "han", type: "general"});
});

it("finds nothing on an empty intersection", () => {
  expect(pieceAt(pieces, {file: 5, rank: 5})).toBeUndefined();
});

it("finds nothing on a board with no pieces on it at all", () => {
  expect(pieceAt(piecesByPosition([]), {file: 1, rank: 10})).toBeUndefined();
});
