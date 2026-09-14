import type {Position} from "@src/game/board/types/Position";
import {getLegalChariotMoves} from "@src/game/moves/GetLegalChariotMoves";
import {expect, it} from "vitest";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("slides any distance along its file and its rank", () => {
  const moves = getLegalChariotMoves(emptyBoard, {file: 1, rank: 10}, "cho");

  expect(moves).toHaveLength(17);
});

it("stops before a piece of its own army", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "soldier"}, position: {file: 1, rank: 7}}]);
  const moves = points(getLegalChariotMoves(board, {file: 1, rank: 10}, "cho"));

  expect(moves).toContain(toPositionKey({file: 1, rank: 8}));
  expect(moves).not.toContain(toPositionKey({file: 1, rank: 7}));
  expect(moves).not.toContain(toPositionKey({file: 1, rank: 6}));
});

it("takes the first enemy piece in its path and goes no further", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 1, rank: 7}}]);
  const moves = points(getLegalChariotMoves(board, {file: 1, rank: 10}, "cho"));

  expect(moves).toContain(toPositionKey({file: 1, rank: 7}));
  expect(moves).not.toContain(toPositionKey({file: 1, rank: 6}));
});

it("slides along a palace diagonal, from a corner through the centre to the far corner", () => {
  const moves = points(getLegalChariotMoves(emptyBoard, {file: 4, rank: 8}, "cho"));

  expect(moves).toContain(toPositionKey({file: 5, rank: 9}));
  expect(moves).toContain(toPositionKey({file: 6, rank: 10}));
});

it("is stopped on a palace diagonal by a piece standing on the palace centre", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "guard"}, position: {file: 5, rank: 9}}]);
  const moves = points(getLegalChariotMoves(board, {file: 4, rank: 8}, "cho"));

  expect(moves).toContain(toPositionKey({file: 5, rank: 9}));
  expect(moves).not.toContain(toPositionKey({file: 6, rank: 10}));
});

it("does not carry on out of the palace along a diagonal", () => {
  const moves = points(getLegalChariotMoves(emptyBoard, {file: 6, rank: 10}, "cho"));

  expect(moves).toContain(toPositionKey({file: 4, rank: 8}));
  expect(moves).not.toContain(toPositionKey({file: 3, rank: 7}));
});

it("uses the diagonals of the enemy palace as readily as its own", () => {
  const moves = points(getLegalChariotMoves(emptyBoard, {file: 4, rank: 1}, "cho"));

  expect(moves).toContain(toPositionKey({file: 5, rank: 2}));
  expect(moves).toContain(toPositionKey({file: 6, rank: 3}));
});

it("has no diagonal at all from the middle of a palace edge", () => {
  const moves = points(getLegalChariotMoves(emptyBoard, {file: 5, rank: 8}, "cho"));

  expect(moves).not.toContain(toPositionKey({file: 4, rank: 9}));
  expect(moves).not.toContain(toPositionKey({file: 6, rank: 9}));
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
