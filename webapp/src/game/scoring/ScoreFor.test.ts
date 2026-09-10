import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SETUPS} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {materialFor} from "@src/game/scoring/MaterialFor";
import {newGame} from "@src/game/NewGame";
import {scoreFor} from "@src/game/scoring/ScoreFor";

/**
 * The 덤 is 대한장기협회's, quoted in `docs/rules.md` §6.5: "초는 72점, 한은 73.5점으로 대국이
 * 시작된다."
 */

it("opens a game at seventy-two for cho", () => {
  expect(scoreFor(newGameFromInnerElephant(), "cho")).toBe(72);
});

it("opens a game at seventy-three and a half for han, the 덤 counted in", () => {
  expect(scoreFor(newGameFromInnerElephant(), "han")).toBe(73.5);
});

it("is cho's material and nothing else, cho paying the 덤 rather than receiving it", () => {
  const state = choToMove(cho("chariot", 1, 10), cho("soldier", 1, 7));

  expect(scoreFor(state, "cho")).toBe(materialFor(state, "cho"));
});

it("is han's material and a point and a half", () => {
  const state = choToMove(han("chariot", 1, 1), han("soldier", 1, 4));

  expect(scoreFor(state, "han")).toBe(materialFor(state, "han") + 1.5);
});

/** Why the compensation is half a point rather than one or two: a scored game cannot come out level. */
it("separates two armies that are level on the board", () => {
  const state = choToMove(cho("chariot", 1, 10), han("chariot", 1, 1));

  expect(materialFor(state, "cho")).toBe(materialFor(state, "han"));
  expect(scoreFor(state, "cho")).not.toBe(scoreFor(state, "han"));
});

function newGameFromInnerElephant(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
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

function cho(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("cho", type, file, rank);
}

function han(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("han", type, file, rank);
}

function placed(side: Side, type: PieceType, file: number, rank: number): PlacedPiece {
  return {piece: {side, type}, position: {file, rank} as PlacedPiece["position"]};
}
