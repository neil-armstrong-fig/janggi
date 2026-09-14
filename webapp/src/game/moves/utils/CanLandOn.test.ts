import {expect, it} from "vitest";
import {canLandOn} from "@src/game/moves/utils/CanLandOn";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";

const board = piecesByPosition([
  {piece: {side: "cho", type: "soldier"}, position: {file: 4, rank: 6}},
  {piece: {side: "han", type: "soldier"}, position: {file: 6, rank: 6}},
]);

it("lands on an empty point", () => {
  expect(canLandOn(board, {file: 5, rank: 6}, "cho")).toBe(true);
});

it("lands on a piece of the other army, which is how a capture is made", () => {
  expect(canLandOn(board, {file: 6, rank: 6}, "cho")).toBe(true);
});

it("refuses a point one of its own army is already standing on", () => {
  expect(canLandOn(board, {file: 4, rank: 6}, "cho")).toBe(false);
});
