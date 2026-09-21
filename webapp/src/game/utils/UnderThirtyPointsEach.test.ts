import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {underThirtyPointsEach} from "@src/game/utils/UnderThirtyPointsEach";
import {placed} from "@src/testing/Placed";

/**
 * The threshold 대한장기협회's 대국규정 puts on both of its endgame clauses — bikjang and
 * repetition. Piece values are in `docs/rules.md` §6.5: 차 13, 포 7, 마 5, 상 3, 사 3, 졸 2, 궁 0.
 */

it("is false at the opening, both armies standing at seventy-two", () => {
  expect(underThirtyPointsEach(newGameFromInnerElephant())).toBe(false);
});

it("is true once both armies are down to a chariot each", () => {
  const state = position(cho("general", 5, 9), cho("chariot", 1, 8), han("general", 5, 2), han("chariot", 9, 3));

  expect(underThirtyPointsEach(state)).toBe(true);
});

it("is false while either army alone is still on thirty or more", () => {
  const state = position(
    cho("general", 5, 9),
    cho("chariot", 1, 8),
    cho("chariot", 2, 8),
    cho("cannon", 3, 8),
    han("general", 5, 2),
    han("chariot", 9, 3),
  );

  expect(underThirtyPointsEach(state)).toBe(false);
});

it("is false at exactly thirty, the rule being 미만 and not 이하", () => {
  const state = position(
    cho("general", 5, 9),
    cho("chariot", 1, 8),
    cho("chariot", 2, 8),
    cho("soldier", 3, 7),
    cho("soldier", 4, 7),
    han("general", 5, 2),
  );

  expect(underThirtyPointsEach(state)).toBe(false);
});

/** Twenty-nine apiece: han's 덤 would carry it to thirty and a half, and the threshold is not it. */
it("ignores the 덤, which is what a game is won on and not what an endgame is recognised by", () => {
  const state = position(
    cho("general", 5, 9),
    cho("chariot", 1, 8),
    cho("chariot", 2, 8),
    cho("guard", 4, 9),
    han("general", 5, 2),
    han("chariot", 9, 3),
    han("chariot", 8, 3),
    han("guard", 6, 2),
  );

  expect(underThirtyPointsEach(state)).toBe(true);
});

function newGameFromInnerElephant(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

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
