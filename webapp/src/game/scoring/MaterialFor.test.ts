import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {materialFor} from "@src/game/scoring/MaterialFor";
import {newGame} from "@src/game/NewGame";
import {placed} from "@src/testing/Placed";

/**
 * The values are 대한장기협회's, quoted in `docs/rules.md` §6.5. Seventy-two is derived from them
 * rather than recorded: if it ever moves, a value has changed and not a number needing an edit.
 */

it("values the pieces the way 대국규정 does", () => {
  expect(worth("chariot")).toBe(13);
  expect(worth("cannon")).toBe(7);
  expect(worth("horse")).toBe(5);
  expect(worth("elephant")).toBe(3);
  expect(worth("guard")).toBe(3);
  expect(worth("soldier")).toBe(2);
});

it("gives the general nothing, a game in which it can be taken being over already", () => {
  expect(worth("general")).toBe(0);
});

it("counts a fresh army at seventy-two", () => {
  const game = newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");

  expect(materialFor(game, "cho")).toBe(72);
});

it("counts both armies alike, even from different setups, every one dealing the same sixteen", () => {
  const game = newGame(setup("Central Chariot"), setup("Left Elephant"), "Casual");

  expect(materialFor(game, "han")).toBe(materialFor(game, "cho"));
});

it("counts only the army it was asked about", () => {
  const state = choToMove(cho("chariot", 1, 10), han("soldier", 1, 4), han("soldier", 3, 4));

  expect(materialFor(state, "cho")).toBe(13);
  expect(materialFor(state, "han")).toBe(4);
});

it("counts an army with nothing left at nothing", () => {
  const state = choToMove(han("chariot", 1, 1));

  expect(materialFor(state, "cho")).toBe(0);
});

/** What one piece of that kind is worth, weighed on an otherwise empty board. */
function worth(type: PieceType): number {
  return materialFor(choToMove(cho(type, 5, 9)), "cho");
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

function choToMove(...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses: 0,
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
