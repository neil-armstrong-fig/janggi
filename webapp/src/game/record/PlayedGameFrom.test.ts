import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";

it("stands the position it was handed as the game being played", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));

  expect(playedGameFrom(state).present).toBe(state);
});

it("has nowhere to take the game back to", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));

  expect(playedGameFrom(state).past).toEqual([]);
});

it("has nothing set aside to play again", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));

  expect(playedGameFrom(state).future).toEqual([]);
});

/** A game half played is recorded exactly as a game about to start is — nothing here reads it. */
it("records a game already under way just as readily as one about to start", () => {
  const state = toMove("han", 1, cho("general", 5, 9), han("general", 5, 2));

  expect(playedGameFrom(state)).toEqual({past: [], present: state, future: []});
});

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
