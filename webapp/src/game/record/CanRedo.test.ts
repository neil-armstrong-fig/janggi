import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canRedo} from "@src/game/record/CanRedo";
import {expect, it} from "vitest";

it("says no before anything has been taken back", () => {
  expect(canRedo(record([board()], board(), []))).toBe(false);
});

it("says yes once a position has been set aside", () => {
  expect(canRedo(record([], board(), [board()]))).toBe(true);
});

it("says yes however far back the game has been taken", () => {
  expect(canRedo(record([], board(), [board(), board(), board()]))).toBe(true);
});

it("says no on a game nobody has played, there being nothing either way", () => {
  expect(canRedo(record([], board(), []))).toBe(false);
});

function record(past: readonly GameState[], present: GameState, future: readonly GameState[]): PlayedGame {
  return {past, present, future};
}

function board(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));
}

function toMove(sideToMove: Side, consecutivePasses: number, ...pieces: readonly PlacedPiece[]): GameState {
  return {pieces, sideToMove, consecutivePasses};
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
