import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {attackersOf} from "@src/game/check/AttackersOf";
import {expect, it} from "vitest";
import {placed} from "@src/testing/Placed";

/**
 * Built by hand for the reason `IsInCheck.test.ts` gives: a check is a shape on the board. Cho's
 * general sits on (5,9), its own palace centre, and file 5 runs between the two palaces.
 */

it("names the chariot giving check down an open file", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 1));

  expect(attackersOf(state, "cho")).toEqual([{file: 5, rank: 1}]);
});

/** A horse steps one point straight, then one diagonally: (4,7) to (4,8) to (5,9). */
it("names both pieces of a double check", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 1), han("horse", 4, 7));

  expect(attackersOf(state, "cho")).toEqual(
    expect.arrayContaining([
      {file: 5, rank: 1},
      {file: 4, rank: 7},
    ]),
  );
  expect(attackersOf(state, "cho")).toHaveLength(2);
});

it("names a piece that attacks while pinned, because a pinned piece still gives check", () => {
  const state = position(cho("general", 5, 9), han("horse", 4, 7), han("general", 4, 2), cho("chariot", 4, 10));

  expect(attackersOf(state, "cho")).toEqual([{file: 4, rank: 7}]);
});

it("names nothing that is blocked", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 1), han("soldier", 5, 5));

  expect(attackersOf(state, "cho")).toEqual([]);
});

it("names nothing where there is no general to attack", () => {
  const state = position(han("chariot", 5, 1));

  expect(attackersOf(state, "cho")).toEqual([]);
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
    drawAgreed: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
