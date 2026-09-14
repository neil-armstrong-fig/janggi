import type {Position} from "@src/game/board/types/Position";
import {expect, it} from "vitest";
import {getLegalGeneralMoves} from "@src/game/moves/GetLegalGeneralMoves";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";

const emptyBoard = piecesByPosition([]);

it("has eight ways to move from the centre of an empty palace", () => {
  expect(getLegalGeneralMoves(emptyBoard, {file: 5, rank: 9}, "cho")).toHaveLength(8);
});

it("may not leave its palace, whatever line leads out of it", () => {
  const moves = points(getLegalGeneralMoves(emptyBoard, {file: 4, rank: 8}, "cho"));

  expect(moves).toEqual(
    points([
      {file: 5, rank: 8},
      {file: 4, rank: 9},
      {file: 5, rank: 9},
    ]),
  );
});

it("captures an enemy piece that has walked into its palace", () => {
  const board = piecesByPosition([{piece: {side: "han", type: "soldier"}, position: {file: 5, rank: 8}}]);

  expect(points(getLegalGeneralMoves(board, {file: 5, rank: 9}, "cho"))).toContain(toPositionKey({file: 5, rank: 8}));
});

/** Its own guards sit on the two corners behind it, taking two of the four diagonals away. */
it("has six ways to move from the palace it starts a game in", () => {
  const board = piecesByPosition([
    {piece: {side: "cho", type: "guard"}, position: {file: 4, rank: 10}},
    {piece: {side: "cho", type: "guard"}, position: {file: 6, rank: 10}},
    {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
  ]);

  expect(points(getLegalGeneralMoves(board, {file: 5, rank: 9}, "cho"))).toEqual(
    points([
      {file: 4, rank: 9},
      {file: 6, rank: 9},
      {file: 5, rank: 8},
      {file: 5, rank: 10},
      {file: 4, rank: 8},
      {file: 6, rank: 8},
    ]),
  );
});

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}
