import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

const opening = newGame(setup("Inner Elephant"), setup("Inner Elephant"));

it("gives nothing for a point with no piece standing on it", () => {
  expect(movesFrom(opening, {file: 5, rank: 5})).toEqual([]);
});

it("answers for a piece of either army, whoever's turn it is", () => {
  expect(movesFrom(opening, {file: 5, rank: 2})).toHaveLength(6);
  expect(movesFrom(opening, {file: 5, rank: 9})).toHaveLength(6);
});

/**
 * The count and every row behind it are worked out point by point in `docs/rules.md` §5. If this
 * number moves, one of the seven movers has changed its mind about a rule.
 */
it("opens the game with thirty-one moves for cho", () => {
  const total = opening.pieces
    .filter(({piece}) => piece.side === "cho")
    .reduce((count, {position}) => count + movesFrom(opening, position).length, 0);

  expect(total).toBe(31);
});

it("leaves both cannons with no move at all in the opening position", () => {
  expect(movesFrom(opening, {file: 2, rank: 8})).toEqual([]);
  expect(movesFrom(opening, {file: 8, rank: 8})).toEqual([]);
});

it("leaves both elephants with no move at all in the inner elephant opening", () => {
  expect(movesFrom(opening, {file: 3, rank: 10})).toEqual([]);
  expect(movesFrom(opening, {file: 7, rank: 10})).toEqual([]);
});

it("sends each chariot two points up its own file and no further", () => {
  expect(points(movesFrom(opening, {file: 1, rank: 10}))).toEqual(
    points([
      {file: 1, rank: 9},
      {file: 1, rank: 8},
    ]),
  );
});

it("sends each horse out past the pieces hemming it in", () => {
  expect(points(movesFrom(opening, {file: 2, rank: 10}))).toEqual(
    points([
      {file: 1, rank: 8},
      {file: 3, rank: 8},
    ]),
  );
});

it("lets a soldier step forward or sideways, but not back", () => {
  expect(points(movesFrom(opening, {file: 1, rank: 7}))).toEqual(
    points([
      {file: 1, rank: 6},
      {file: 2, rank: 7},
    ]),
  );
});

it("gives each guard the two empty palace points beside it", () => {
  expect(points(movesFrom(opening, {file: 4, rank: 10}))).toEqual(
    points([
      {file: 5, rank: 10},
      {file: 4, rank: 9},
    ]),
  );
});

/**
 * A move is legal only if its own general survives it, so these are the cases the seven movers
 * cannot answer alone. Cho's general sits on (5,9) and file 5 runs the length of the board.
 */
it("does not offer a move that would leave its own general in check", () => {
  const pinned = position(cho("general", 5, 9), cho("chariot", 5, 8), han("chariot", 5, 1));

  const moves = points(movesFrom(pinned, {file: 5, rank: 8}));

  expect(moves).not.toContain(toPositionKey({file: 4, rank: 8}));
  expect(moves).not.toContain(toPositionKey({file: 6, rank: 8}));
});

/** A pinned piece may still move along the line it is pinned on, because it stays in the way. */
it("still offers a pinned piece the moves that keep it in the way", () => {
  const pinned = position(cho("general", 5, 9), cho("chariot", 5, 8), han("chariot", 5, 1));

  expect(points(movesFrom(pinned, {file: 5, rank: 8}))).toContain(toPositionKey({file: 5, rank: 7}));
});

it("does not let a general step onto a point the enemy attacks", () => {
  const covered = position(cho("general", 5, 9), han("chariot", 4, 1));

  const moves = points(movesFrom(covered, {file: 5, rank: 9}));

  expect(moves).not.toContain(toPositionKey({file: 4, rank: 8}));
  expect(moves).not.toContain(toPositionKey({file: 4, rank: 9}));
  expect(moves).not.toContain(toPositionKey({file: 4, rank: 10}));
  expect(moves).toContain(toPositionKey({file: 6, rank: 9}));
});

it("offers only the moves that answer a check", () => {
  const inCheck = position(cho("general", 5, 9), cho("chariot", 1, 8), han("chariot", 5, 1));

  // The chariot's one useful move is onto file 5, where it blocks the check.
  expect(points(movesFrom(inCheck, {file: 1, rank: 8}))).toEqual([toPositionKey({file: 5, rank: 8})]);
});

function position(...pieces: readonly PlacedPiece[]): GameState {
  return {pieces, sideToMove: "cho", consecutivePasses: 0};
}

function cho(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("cho", type, file, rank);
}

function han(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("han", type, file, rank);
}

function placed(side: Side, type: PieceType, file: number, rank: number): PlacedPiece {
  return {piece: {side, type}, position: {file, rank} as PlacedPiece["position"]};
}

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
