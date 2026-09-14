import type {Position} from "@src/game/board/types/Position";
import {expect, it} from "vitest";
import {getLegalHorseMoves} from "@src/game/moves/GetLegalHorseMoves";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("reaches the eight points one step and one turn away", () => {
  const moves = getLegalHorseMoves(emptyBoard, {file: 5, rank: 5}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 4, rank: 3},
      {file: 6, rank: 3},
      {file: 4, rank: 7},
      {file: 6, rank: 7},
      {file: 3, rank: 4},
      {file: 3, rank: 6},
      {file: 7, rank: 4},
      {file: 7, rank: 6},
    ]),
  );
});

it("is blocked by a piece standing on the point it steps to first", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 5, rank: 4}}]);
  const moves = points(getLegalHorseMoves(board, {file: 5, rank: 5}, "cho"));

  expect(moves).not.toContain(toPositionKey({file: 4, rank: 3}));
  expect(moves).not.toContain(toPositionKey({file: 6, rank: 3}));
  expect(moves).toContain(toPositionKey({file: 3, rank: 4}));
});

it("is blocked by its own army exactly as it is by the enemy", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 4}}]);

  expect(points(getLegalHorseMoves(board, {file: 5, rank: 5}, "cho"))).not.toContain(toPositionKey({file: 4, rank: 3}));
});

it("does not turn off the edge of the board", () => {
  const moves = getLegalHorseMoves(emptyBoard, {file: 1, rank: 1}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 2, rank: 3},
      {file: 3, rank: 2},
    ]),
  );
});

it("captures an enemy piece on a point it can reach", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "chariot"}, position: {file: 4, rank: 3}}]);

  expect(points(getLegalHorseMoves(board, {file: 5, rank: 5}, "cho"))).toContain(toPositionKey({file: 4, rank: 3}));
});

it("will not land on a piece of its own army", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "chariot"}, position: {file: 4, rank: 3}}]);

  expect(points(getLegalHorseMoves(board, {file: 5, rank: 5}, "cho"))).not.toContain(toPositionKey({file: 4, rank: 3}));
});

/** Its own chariot and elephant hem it in on the back rank, leaving the two points beyond them. */
it("has exactly two ways out of the corner it starts a game in", () => {
  const board = piecesByPosition([
    {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
    {piece: {side: "cho", type: "horse"}, position: {file: 2, rank: 10}},
    {piece: {side: "cho", type: "elephant"}, position: {file: 3, rank: 10}},
  ]);

  expect(points(getLegalHorseMoves(board, {file: 2, rank: 10}, "cho"))).toEqual(
    points([
      {file: 1, rank: 8},
      {file: 3, rank: 8},
    ]),
  );
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
