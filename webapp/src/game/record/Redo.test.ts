import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {redo} from "@src/game/record/Redo";
import {undo} from "@src/game/record/Undo";

it("stands the game on the nearest position that had been taken back", () => {
  const nearest = reached();

  expect(redo(record([], board(), [nearest, board()])).present).toBe(nearest);
});

it("takes that position off the ones set aside", () => {
  const furtherOn = board();

  expect(redo(record([], board(), [reached(), furtherOn])).future).toEqual([furtherOn]);
});

it("keeps the position it left, as the newest thing played", () => {
  const left = board();

  expect(redo(record([], left, [reached()])).past).toEqual([left]);
});

/** The two are each other's inverse: the same values move back between the same two lists. */
it("gives back exactly the record undo took away", () => {
  const played = record([board()], reached(), []);

  expect(redo(undo(played))).toEqual(played);
});

it("leaves the record it was handed untouched", () => {
  const played = record([], board(), [reached()]);

  redo(played);

  expect(played.past).toEqual([]);
  expect(played.future).toHaveLength(1);
});

it("refuses when nothing has been taken back", () => {
  expect(() => redo(record([board()], reached(), []))).toThrow("nothing to play again");
});

function record(past: readonly GameState[], present: GameState, future: readonly GameState[]): PlayedGame {
  return {past, present, future};
}

function board(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));
}

function reached(): GameState {
  return toMove("han", 0, cho("general", 5, 8), han("general", 5, 2));
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
