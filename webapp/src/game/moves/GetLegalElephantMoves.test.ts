import type {Position} from "@src/game/board/types/Position";
import {getLegalElephantMoves} from "@src/game/moves/GetLegalElephantMoves";
import {expect, it} from "vitest";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("reaches the eight points one step and two turns away", () => {
  const moves = getLegalElephantMoves(emptyBoard, {file: 5, rank: 5}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 3, rank: 2},
      {file: 7, rank: 2},
      {file: 3, rank: 8},
      {file: 7, rank: 8},
      {file: 2, rank: 3},
      {file: 2, rank: 7},
      {file: 8, rank: 3},
      {file: 8, rank: 7},
    ]),
  );
});

it("is blocked by a piece standing on the point it steps to first", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 5, rank: 4}}]);
  const moves = points(getLegalElephantMoves(board, {file: 5, rank: 5}, "cho"));

  expect(moves).not.toContain(toPositionKey({file: 3, rank: 2}));
  expect(moves).not.toContain(toPositionKey({file: 7, rank: 2}));
  expect(moves).toContain(toPositionKey({file: 2, rank: 3}));
});

it("is blocked by a piece on the first of its two diagonal points as well", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 4, rank: 3}}]);
  const moves = points(getLegalElephantMoves(board, {file: 5, rank: 5}, "cho"));

  expect(moves).not.toContain(toPositionKey({file: 3, rank: 2}));
  expect(moves).toContain(toPositionKey({file: 7, rank: 2}));
});

it("crosses to the enemy half of the board, there being no river to stop it", () => {
  expect(points(getLegalElephantMoves(emptyBoard, {file: 5, rank: 5}, "cho"))).toContain(
    toPositionKey({file: 3, rank: 2}),
  );
});

it("does not turn off the edge of the board", () => {
  const moves = getLegalElephantMoves(emptyBoard, {file: 1, rank: 1}, "cho");

  expect(points(moves)).toEqual(
    points([
      {file: 3, rank: 4},
      {file: 4, rank: 3},
    ]),
  );
});

it("captures an enemy piece where it lands", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "chariot"}, position: {file: 3, rank: 2}}]);

  expect(points(getLegalElephantMoves(board, {file: 5, rank: 5}, "cho"))).toContain(toPositionKey({file: 3, rank: 2}));
});

it("will not land on a piece of its own army", () => {
  const board = piecesByPosition([{piece: {side: "cho", type: "chariot"}, position: {file: 3, rank: 2}}]);

  expect(points(getLegalElephantMoves(board, {file: 5, rank: 5}, "cho"))).not.toContain(
    toPositionKey({file: 3, rank: 2}),
  );
});

/**
 * Its own cannon blocks one diagonal at the second point and its own centre soldier occupies where
 * the other one lands, so an inner elephant has nowhere at all to go until a soldier is swept —
 * which is exactly the opening advice in `docs/opening-setups.md` §3.
 */
it("has no move at all from the inner elephant opening", () => {
  const board = piecesByPosition([
    {piece: {side: "cho", type: "horse"}, position: {file: 2, rank: 10}},
    {piece: {side: "cho", type: "elephant"}, position: {file: 3, rank: 10}},
    {piece: {side: "cho", type: "guard"}, position: {file: 4, rank: 10}},
    {piece: {side: "cho", type: "cannon"}, position: {file: 2, rank: 8}},
    {piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 7}},
  ]);

  expect(getLegalElephantMoves(board, {file: 3, rank: 10}, "cho")).toEqual([]);
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
