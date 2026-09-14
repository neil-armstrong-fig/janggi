import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SETUPS} from "@src/game/setups/Setups";
import {applyMove} from "@src/game/ApplyMove";
import {expect, it} from "vitest";
import {movablePieces} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/MovablePieces";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/PositionKeys";

it("marks the army to move, and only that army", () => {
  const movable = movablePieces(opening(), PLAYABLE);

  expect(movable.has(toPositionKey({file: 1, rank: 10}))).toBe(true);
  expect(movable.has(toPositionKey({file: 1, rank: 1}))).toBe(false);
});

/**
 * A mate needs no guard — a mated army has no legal move, so nothing is marked anyway. A game
 * stopped by two rested turns is the case that does: the position is still full of moves.
 */
it("marks nothing at all once both armies have rested a turn and stopped the game", () => {
  const stopped: GameState = {...opening(), consecutivePasses: 2};

  expect(movablePieces(stopped, PLAYABLE).size).toBe(0);
});

it("marks nothing on an empty point", () => {
  expect(movablePieces(opening(), PLAYABLE).has(toPositionKey({file: 5, rank: 5}))).toBe(false);
});

it("changes hands once a move has been played", () => {
  const afterChoOpens = applyMove(opening(), {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});

  const movable = movablePieces(afterChoOpens, PLAYABLE);

  expect(movable.has(toPositionKey({file: 1, rank: 1}))).toBe(true);
  expect(movable.has(toPositionKey({file: 1, rank: 10}))).toBe(false);
});

/**
 * A horse standing between its own general and a chariot has nowhere to go: every move it owns
 * leaves the file, and stepping off the file uncovers the general.
 *
 * A horse rather than a guard or a soldier on purpose — those can slide *along* the pin and so are
 * not stuck at all, which is what the first version of this test got wrong.
 */
it("does not mark a piece pinned against its own general", () => {
  const pinned = position("han", han("general", 5, 2), han("horse", 5, 4), cho("chariot", 5, 9), cho("general", 4, 9));

  const movable = movablePieces(pinned, PLAYABLE);

  expect(movable.has(toPositionKey({file: 5, rank: 4}))).toBe(false);
  expect(movable.has(toPositionKey({file: 5, rank: 2}))).toBe(true);
});

/**
 * The criterion the whole feature exists for. Han is in check down file 5; the general can step
 * aside and the chariot can come back to block, and nothing else on the board is any use.
 */
it("marks only the pieces that can answer a check", () => {
  const inCheck = position(
    "han",
    han("general", 5, 2),
    han("chariot", 1, 5),
    han("soldier", 9, 5),
    cho("chariot", 5, 9),
    cho("general", 4, 9),
  );

  const movable = movablePieces(inCheck, PLAYABLE);

  expect(movable.has(toPositionKey({file: 5, rank: 2}))).toBe(true);
  expect(movable.has(toPositionKey({file: 1, rank: 5}))).toBe(true);
  expect(movable.has(toPositionKey({file: 9, rank: 5}))).toBe(false);
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

function position(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "cho", type}, position: {file, rank}};
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "han", type}, position: {file, rank}};
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

/**
 * A scored board still being laid out. Nothing on it is anybody's to move yet, however full of
 * legal moves the position `boardShownFor` is painting happens to be.
 */
it("marks nothing while the board is still being laid out", () => {
  expect(movablePieces(opening(), NOT_YET_LAID_OUT).size).toBe(0);
});

/** Whether there is a game here to play — every case above is about one that has begun. */
const PLAYABLE = true;
const NOT_YET_LAID_OUT = false;
