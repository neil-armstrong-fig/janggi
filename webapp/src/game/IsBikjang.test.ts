import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {isBikjang} from "@src/game/IsBikjang";

/**
 * 빅장 is the position alone — two generals down one file with nothing in the way. Whether anyone
 * may call it is `canCallBikjang`'s question, and none of it is asked here. See `docs/rules.md`
 * §6.2.
 */

it("is a bikjang with the two generals facing down an empty file", () => {
  expect(isBikjang(position(cho("general", 5, 9), han("general", 5, 2)))).toBe(true);
});

it("is a bikjang down a wing file of the palace as much as the middle one", () => {
  expect(isBikjang(position(cho("general", 4, 9), han("general", 4, 2)))).toBe(true);
});

it("is no bikjang with the generals on different files", () => {
  expect(isBikjang(position(cho("general", 4, 9), han("general", 5, 2)))).toBe(false);
});

it("is no bikjang with a piece standing between them", () => {
  const state = position(cho("general", 5, 9), cho("soldier", 5, 5), han("general", 5, 2));

  expect(isBikjang(state)).toBe(false);
});

it("does not care whose piece blocks the file", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 5), han("general", 5, 2));

  expect(isBikjang(state)).toBe(false);
});

it("is unmoved by pieces standing on the file outside the two generals", () => {
  const state = position(cho("general", 5, 9), cho("chariot", 5, 10), han("general", 5, 2), han("chariot", 5, 1));

  expect(isBikjang(state)).toBe(true);
});

it("is no bikjang when only one army has a general on the board", () => {
  expect(isBikjang(position(cho("general", 5, 9), han("chariot", 5, 2)))).toBe(false);
});

function position(...pieces: readonly PlacedPiece[]): GameState {
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
