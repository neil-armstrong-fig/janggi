import type {GameState} from "@src/game/types/GameState";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Position} from "@src/game/board/types/Position";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {coveredFrom} from "@src/game/moves/CoveredFrom";
import {expect, it} from "vitest";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/PositionKeys";

const opening = newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");

it("gives nothing for a point with no piece standing on it", () => {
  expect(coveredFrom(opening, {file: 5, rank: 5})).toEqual([]);
});

it("gives the soldier on the far corner of the inner elephant's one open way out", () => {
  expect(points(coveredFrom(opening, {file: 3, rank: 10}))).toEqual(points([{file: 5, rank: 7}]));
});

it("stops the chariot at the first piece of its own army on each line", () => {
  expect(points(coveredFrom(opening, {file: 1, rank: 10}))).toEqual(
    points([
      {file: 1, rank: 7},
      {file: 2, rank: 10},
    ]),
  );
});

it("gives nothing for a horse whose landing points are all empty or blocked on the way", () => {
  expect(coveredFrom(opening, {file: 2, rank: 10})).toEqual([]);
});

it("never gives a point the enemy stands on, that being a move rather than a cover", () => {
  const board = position([
    {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 5}},
    {piece: {side: "han", type: "soldier"}, position: {file: 1, rank: 4}},
    {piece: {side: "cho", type: "soldier"}, position: {file: 2, rank: 5}},
  ]);

  expect(points(coveredFrom(board, {file: 1, rank: 5}))).toEqual(points([{file: 2, rank: 5}]));
});

it("does not give the cannon's own screen, which it jumps rather than lands on", () => {
  const board = position([
    {piece: {side: "cho", type: "cannon"}, position: {file: 1, rank: 10}},
    {piece: {side: "cho", type: "soldier"}, position: {file: 1, rank: 8}},
    {piece: {side: "cho", type: "horse"}, position: {file: 1, rank: 5}},
  ]);

  expect(points(coveredFrom(board, {file: 1, rank: 10}))).toEqual(points([{file: 1, rank: 5}]));
});

/**
 * Where a piece's own rules would take it is the whole question, so a pin does not come into it — a
 * pinned horse still shows its shape, as `pseudoLegalMovesFrom` still counts it as attacking.
 */
it("still gives what a pinned piece covers, though it has no move", () => {
  const board = position([
    {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
    {piece: {side: "cho", type: "horse"}, position: {file: 5, rank: 7}},
    {piece: {side: "cho", type: "soldier"}, position: {file: 4, rank: 5}},
    {piece: {side: "han", type: "chariot"}, position: {file: 5, rank: 1}},
  ]);

  expect(movesFrom(board, {file: 5, rank: 7})).toEqual([]);
  expect(points(coveredFrom(board, {file: 5, rank: 7}))).toEqual(points([{file: 4, rank: 5}]));
});

function position(pieces: readonly PlacedPiece[]): GameState {
  return {...opening, pieces};
}

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
