import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {pass} from "@src/game/passing/Pass";
import {placed} from "@src/testing/Placed";

/**
 * 한수쉼 — lifting the general off the board and setting it back down. See `docs/rules.md` §6.3.
 */

it("hands the turn to the other army", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));

  expect(pass(state).sideToMove).toBe("han");
});

it("leaves every piece exactly where it stood", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2));

  expect(pass(state).pieces).toEqual(state.pieces);
});

it("counts the rested turn", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));

  expect(pass(state).consecutivePasses).toBe(1);
});

it("counts a second rested turn on top of the first", () => {
  const state = toMove("cho", 1, cho("general", 5, 9), han("general", 5, 2));

  expect(pass(state).consecutivePasses).toBe(2);
});

it("leaves the state it was handed untouched, so a game stays replayable", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));

  pass(state);

  expect(state.sideToMove).toBe("cho");
  expect(state.consecutivePasses).toBe(0);
});

it("refuses while the army to move is in check", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2), han("chariot", 5, 3));

  expect(() => pass(state)).toThrow("cho is in check");
});

it("refuses once the game is over", () => {
  const state = toMove("cho", 2, cho("general", 5, 9), han("general", 5, 2));

  expect(() => pass(state)).toThrow("The game is over");
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

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
