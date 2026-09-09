import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canUndo} from "@src/game/record/CanUndo";
import {expect, it} from "vitest";

it("says no before anything at all has been played", () => {
  expect(canUndo(record([], board(), []))).toBe(false);
});

it("says yes once a position has been left behind", () => {
  expect(canUndo(record([board()], board(), []))).toBe(true);
});

it("says yes however deep the game has got", () => {
  expect(canUndo(record([board(), board(), board()], board(), []))).toBe(true);
});

it("says no again once the game has been taken all the way back", () => {
  expect(canUndo(record([], board(), [board(), board()]))).toBe(false);
});

/**
 * The one place this parts company with `canPass`, which refuses once the game is decided. A decided
 * game is exactly when a player reaches for undo, so nothing here asks `outcomeOf`.
 */
it("still says yes once the game has been settled on points", () => {
  const settled = toMove("cho", 2, cho("general", 5, 9), han("general", 5, 2));

  expect(canUndo(record([board()], settled, []))).toBe(true);
});

function record(past: readonly GameState[], present: GameState, future: readonly GameState[]): PlayedGame {
  return {past, present, future};
}

function board(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));
}

function toMove(sideToMove: Side, consecutivePasses: number, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
    consecutivePasses,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
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
