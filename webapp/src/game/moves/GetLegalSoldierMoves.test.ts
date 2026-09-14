import type {Position} from "@src/game/board/types/Position";
import {expect, it} from "vitest";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {getLegalSoldierMoves} from "@src/game/moves/GetLegalSoldierMoves";
import {toPositionKey} from "@src/game/board/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("steps one point forward, or one point to either side", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 5, rank: 5}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 5, rank: 4},
      {file: 4, rank: 5},
      {file: 6, rank: 5},
    ]),
  );
});

it("never steps backwards", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 5, rank: 5}, "cho");

  expect(points(moves)).not.toContain(toPositionKey({file: 5, rank: 6}));
});

it("sends a cho soldier towards rank 1 and a han soldier towards rank 10", () => {
  expect(points(getLegalSoldierMoves(emptyBoard, {file: 5, rank: 5}, "cho"))).toContain(
    toPositionKey({file: 5, rank: 4}),
  );
  expect(points(getLegalSoldierMoves(emptyBoard, {file: 5, rank: 5}, "han"))).toContain(
    toPositionKey({file: 5, rank: 6}),
  );
});

it("stops at the edge of the board rather than stepping off it", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 1, rank: 1}, "cho");

  expect(points(moves)).toEqual(points([{file: 2, rank: 1}]));
});

it("captures an enemy piece on any point it can step to", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "chariot"}, position: {file: 5, rank: 4}}]);

  expect(points(getLegalSoldierMoves(board, {file: 5, rank: 5}, "cho"))).toContain(toPositionKey({file: 5, rank: 4}));
});

it("will not step onto a piece of its own army", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "chariot"}, position: {file: 5, rank: 4}}]);

  expect(points(getLegalSoldierMoves(board, {file: 5, rank: 5}, "cho"))).not.toContain(
    toPositionKey({file: 5, rank: 4}),
  );
});

it("takes a palace diagonal once it is standing in the enemy palace", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 4, rank: 3}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 4, rank: 2},
      {file: 3, rank: 3},
      {file: 5, rank: 3},
      {file: 5, rank: 2},
    ]),
  );
});

it("takes only the palace diagonals that lead forward", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 5, rank: 2}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 5, rank: 1},
      {file: 4, rank: 2},
      {file: 6, rank: 2},
      {file: 4, rank: 1},
      {file: 6, rank: 1},
    ]),
  );
});

it("has no diagonal left from a corner whose only line points back the way it came", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 4, rank: 1}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 3, rank: 1},
      {file: 5, rank: 1},
    ]),
  );
});

it("ignores the diagonals of its own palace", () => {
  const moves = getLegalSoldierMoves(emptyBoard, {file: 5, rank: 9}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 5, rank: 8},
      {file: 4, rank: 9},
      {file: 6, rank: 9},
    ]),
  );
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
