import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canPass} from "@src/game/CanPass";
import {expect, it} from "vitest";

/**
 * Passing is unrestricted but for a check, which has to be answered. See `docs/rules.md` §6.3, and
 * `CanPass.ts` for why the check is a rule no source states.
 */

it("lets the army to move rest a turn with a whole board still to play", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2));

  expect(canPass(state)).toBe(true);
});

it("lets it rest a turn when it has nothing else to play, there being no stalemate in janggi", () => {
  const state = toMove(
    "cho",
    0,
    cho("general", 4, 10),
    han("general", 5, 2),
    han("chariot", 5, 5),
    han("chariot", 9, 9),
  );

  expect(canPass(state)).toBe(true);
});

it("refuses while the army to move is in check", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2), han("chariot", 5, 3));

  expect(canPass(state)).toBe(false);
});

it("says nothing about a check the other army is under, which is not its turn to answer", () => {
  const state = toMove("cho", 0, cho("general", 5, 9), cho("chariot", 5, 8), han("general", 5, 2));

  expect(canPass(state)).toBe(true);
});

it("refuses once the game is over", () => {
  const state = toMove("cho", 2, cho("general", 5, 9), han("general", 5, 2));

  expect(canPass(state)).toBe(false);
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
