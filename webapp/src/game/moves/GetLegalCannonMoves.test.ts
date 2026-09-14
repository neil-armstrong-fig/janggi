import type {Position} from "@src/game/board/types/Position";
import {getLegalCannonMoves} from "@src/game/moves/GetLegalCannonMoves";
import {expect, it} from "vitest";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("cannot move at all with nothing to jump", () => {
  expect(getLegalCannonMoves(emptyBoard, {file: 5, rank: 5}, "cho")).toEqual([]);
});

it("lands on any empty point beyond the piece it jumps", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 5, rank: 3}}]);

  expect(points(getLegalCannonMoves(board, {file: 5, rank: 5}, "cho"))).toEqual(
    points([
      {file: 5, rank: 2},
      {file: 5, rank: 1},
    ]),
  );
});

it("does not stop on the points before the screen", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 5, rank: 3}}]);

  expect(points(getLegalCannonMoves(board, {file: 5, rank: 5}, "cho"))).not.toContain(
    toPositionKey({file: 5, rank: 4}),
  );
});

it("jumps a piece of its own army as readily as one of the enemy's", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 3}}]);

  expect(points(getLegalCannonMoves(board, {file: 5, rank: 5}, "cho"))).toContain(toPositionKey({file: 5, rank: 2}));
});

it("takes the first enemy piece beyond the screen and goes no further", () => {
  const board = piecesByPosition([
    {piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 3}},
    {piece: {side: "han", type: "chariot"}, position: {file: 5, rank: 2}},
  ]);

  expect(points(getLegalCannonMoves(board, {file: 5, rank: 5}, "cho"))).toEqual(points([{file: 5, rank: 2}]));
});

it("stops short of a piece of its own army beyond the screen", () => {
  const board = piecesByPosition([
    {piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 3}},
    {piece: {side: "cho", type: "chariot"}, position: {file: 5, rank: 1}},
  ]);

  expect(points(getLegalCannonMoves(board, {file: 5, rank: 5}, "cho"))).toEqual(points([{file: 5, rank: 2}]));
});

it("will not use another cannon as its screen, whoever it belongs to", () => {
  const enemyCannon = piecesByPosition([{piece: {side: "han", type: "cannon"}, position: {file: 5, rank: 3}}]);
  const ownCannon = piecesByPosition([{piece: {side: "cho", type: "cannon"}, position: {file: 5, rank: 3}}]);

  expect(getLegalCannonMoves(enemyCannon, {file: 5, rank: 5}, "cho")).toEqual([]);
  expect(getLegalCannonMoves(ownCannon, {file: 5, rank: 5}, "cho")).toEqual([]);
});

it("will not capture another cannon", () => {
  const board = piecesByPosition([
    {piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 3}},
    {piece: {side: "han", type: "cannon"}, position: {file: 5, rank: 2}},
  ]);

  expect(getLegalCannonMoves(board, {file: 5, rank: 5}, "cho")).toEqual([]);
});

it("crosses a palace corner to corner, over whatever stands on the centre", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "guard"}, position: {file: 5, rank: 9}}]);

  expect(points(getLegalCannonMoves(board, {file: 4, rank: 8}, "cho"))).toEqual(points([{file: 6, rank: 10}]));
});

it("has no diagonal at all when the palace centre is empty", () => {
  expect(getLegalCannonMoves(emptyBoard, {file: 4, rank: 8}, "cho")).toEqual([]);
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
