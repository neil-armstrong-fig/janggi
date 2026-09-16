import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {expect, it} from "vitest";
import {placed} from "@src/testing/Placed";

/**
 * Where the two match formats part company. Casually the generals facing each other is the whole of
 * it; under the KJA's scored format the call is gated on thirty points a side and refused where a
 * general took its way there. See `docs/rules.md` §6.2.
 */

it("lets a casual game call a bikjang with both armies whole", () => {
  expect(canCallBikjang(bikjang("Casual", cho("chariot", 1, 8), cho("cannon", 2, 8)))).toBe(true);
});

it("has nothing to call where the generals are not facing each other", () => {
  const state = position("Casual", "cho", cho("general", 4, 9), han("general", 5, 2));

  expect(canCallBikjang(state)).toBe(false);
});

it("has nothing to call with a piece standing between the generals", () => {
  const state = position("Casual", "cho", cho("general", 5, 9), cho("soldier", 5, 5), han("general", 5, 2));

  expect(canCallBikjang(state)).toBe(false);
});

it("refuses a scored call while either army is still on thirty points or more", () => {
  const state = bikjang("Scored", cho("chariot", 1, 8), cho("chariot", 2, 8), cho("cannon", 3, 8));

  expect(canCallBikjang(state)).toBe(false);
});

it("allows a scored call once both armies are under thirty", () => {
  expect(canCallBikjang(bikjang("Scored", cho("chariot", 1, 8)))).toBe(true);
});

/** "단, 궁으로 상대 기물 취하면서 빅장이 되는 경우는 예외로 한다." */
it("refuses a scored call on a bikjang the general took its way into", () => {
  const state: GameState = {...bikjang("Scored", cho("chariot", 1, 8)), reachedByAGeneralCapture: true};

  expect(canCallBikjang(state)).toBe(false);
});

/** The exception is the scored format's, quoted alongside its threshold and not stated apart. */
it("allows a casual call on one the general took its way into all the same", () => {
  const state: GameState = {...bikjang("Casual", cho("chariot", 1, 8)), reachedByAGeneralCapture: true};

  expect(canCallBikjang(state)).toBe(true);
});

it("has nothing to call once the game is already over", () => {
  const state: GameState = {...bikjang("Casual", cho("chariot", 1, 8)), consecutivePasses: 2};

  expect(canCallBikjang(state)).toBe(false);
});

/** The two generals down the middle file with nothing between them, and whatever else is named. */
function bikjang(format: MatchFormat, ...rest: readonly PlacedPiece[]): GameState {
  return position(format, "cho", cho("general", 5, 9), han("general", 5, 2), han("chariot", 9, 3), ...rest);
}

function position(format: MatchFormat, sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format,
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
