import type {Position} from "@src/game/board/types/Position";
import {expect, it} from "vitest";
import {getLegalGuardMoves} from "@src/game/moves/GetLegalGuardMoves";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("steps one point in every direction the palace draws a line for", () => {
  const moves = getLegalGuardMoves(emptyBoard, {file: 4, rank: 10}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 5, rank: 10},
      {file: 4, rank: 9},
      {file: 5, rank: 9},
    ]),
  );
});

it("stays inside the palace rather than stepping out onto the open board", () => {
  const moves = getLegalGuardMoves(emptyBoard, {file: 4, rank: 10}, "cho");

  expect(points(moves)).not.toContain(toPositionKey({file: 3, rank: 10}));
});

it("takes all four diagonals from the centre of the palace", () => {
  const moves = getLegalGuardMoves(emptyBoard, {file: 5, rank: 9}, "cho");

  expect(moves).toHaveLength(8);
});

it("has no diagonal at all from the middle of a palace edge", () => {
  const moves = getLegalGuardMoves(emptyBoard, {file: 5, rank: 10}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 4, rank: 10},
      {file: 6, rank: 10},
      {file: 5, rank: 9},
    ]),
  );
});

it("captures an enemy piece standing on a point it can reach", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 5, rank: 9}}]);

  expect(points(getLegalGuardMoves(board, {file: 4, rank: 10}, "cho"))).toContain(toPositionKey({file: 5, rank: 9}));
});

it("will not step onto a piece of its own army", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}}]);

  expect(points(getLegalGuardMoves(board, {file: 4, rank: 10}, "cho"))).not.toContain(
    toPositionKey({file: 5, rank: 9}),
  );
});

it("uses its own palace, not the one at the far end of the board", () => {
  const moves = getLegalGuardMoves(emptyBoard, {file: 4, rank: 1}, "han");

  expect(points(moves)).toEqual(
    points([
      {file: 5, rank: 1},
      {file: 4, rank: 2},
      {file: 5, rank: 2},
    ]),
  );
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
